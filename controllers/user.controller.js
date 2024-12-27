const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const { Op } = require("sequelize");
const Uploader = require("../utils/uploader");
const { sequelize } = require("../models/user.model");
const Review = require("../models/review.model");
const Order = require("../models/order.model");
const { getCoordinates, getDistance } = require('../middlewares/google');
const { sendUserDeleteEmail } = require("../services/email.service");
const Package = require("../models/package.model");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role", "niches", "topCreator"]);
  const currentDate = new Date();
  const ageDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - req.query.age));

  let filters = {
    ...filter,

    ...(req.query.gender && {
      gender: req.query.gender,
    }),
    ...(req.query.availability && {
      availability: true,
    }),
    ...(req.query.search && {
      [Op.or]: [
        { firstName: { [Op.like]: `%${req.query.search}%` } },
        { lastName: { [Op.like]: `%${req.query.search}%` } },
        { niches: { [Op.like]: `%${req.query.search}%` } },
        { languages: { [Op.like]: `%${req.query.search}%` } },
      ],
    }),
    ...(req.query.age && {
      dayOfBirth: {
        [Op.lte]: ageDate,
      },
    }),
    ...(req.query.niches && {
      niches: {
        [Op.like]: `%${req.query.niches}%`,
      },
    }),
    ...(req.query.languages && {
      languages: {
        [Op.like]: `%${req.query.languages}%`,
      },
    }),
    ...(req.query.withVideo && {
      video1: {
        [Op.ne]: null,
      },
    }),
  };
  if (req.query.price) {
    const priceFilters = {
      "50-100": { [Op.between]: [59, 100] },
      "100-200": { [Op.between]: [100, 200] },
      "200+": { [Op.gte]: 200 },
    };

    filters["$packages.totalCost$"] = priceFilters[req.query.price];
  }

  const options = pick(req.query, ["limit", "page", "sortBy"]);

  if (req.query.sortBy) {
    const sortFields = {
      "reviewStars": sequelize.literal('averageReviewStars'),
      "orders": sequelize.literal('orderCount')
    };
    const order = sortFields[req.query.sortBy]
    options.order = [
      [sequelize.literal("goldVerified"), 'DESC'],
      [sequelize.literal("blueVerified"), 'DESC'],
      [sequelize.literal('CAST(rank AS UNSIGNED)'), 'DESC'],
      [order, 'DESC']];
  }

  if (req.query.distance && req.query.distance !== 0) {
    const user = await userService.getUserById(req.query.userId);
    const buyerCoordinates = await getCoordinates(user.dataValues.physicalPostalCode || user.dataValues.postalCode);

    if (buyerCoordinates) {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = (page - 1) * limit;

      const allUsers = await userService.queryUsers(filters, { limit: 10000, page: 0 });

      const creatorZipCodes = allUsers.data.map(user => user.dataValues.physicalPostalCode || user.dataValues.postalCode);

      const creatorCoordinates = await Promise.all(creatorZipCodes.map(zip => getCoordinates(zip)));
      const distances = await getDistance(buyerCoordinates, creatorCoordinates);

      const maxDistance = parseInt(req.query.distance, 10) * 1000;

      const filteredUsers = allUsers.data.filter((_, index) => distances[index].distance.value <= maxDistance);

      const paginatedUsers = filteredUsers.slice(offset, offset + limit);
      const totalPages = Math.ceil(filteredUsers.length / limit);

      return res.send({
        data: paginatedUsers,
        meta: {
          pagination: {
            page,
            pageSize: limit,
            pageCount: totalPages,
            total: filteredUsers.length,
          },
        },
      });
    } else {
      return res.status(400).send({ message: "Invalid buyer zip code" });
    }
  }

  const result = await userService.queryUsers(filters, {
    ...options,
    include: [
      {
        model: Review,
        attributes: [],
        required: false,
      },
      {
        model: Order,
        attributes: [],
        required: false,
      },
      {
        model: Package,
        attributes: [],
        as: 'packages',
        required: true,
      },
    ],
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("reviews.stars")), "averageReviewStars"],
        [sequelize.fn("COUNT", sequelize.col("orders.id")), "orderCount"],
      ],
    },
    group: ["user.id"],
  });

  res.send(result);
});

const getUserMoneySummary = catchAsync(async (req, res) => {
  const result = await userService.getUserByIdMoneySummary(req.params.userId)
  res.send(result);
})

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send({ code: httpStatus.OK, message: "Got user !", user });
});

const uploadFile = catchAsync(async (req, res) => {
  console.log(req.files)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({
      code: httpStatus.BAD_REQUEST,
      message: 'No files were uploaded.',
    });
  }
  console.log("HERER", req.body)
  const { video1 } = req.files;

  const emitProgress = async (progress) => {
    try {
      await fetch('http://localhost:8080/upload-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uploadProgress: progress, name: req.body.name }),
      });
    } catch (error) {
      console.error('Error sending progress:', error);
    }
  };

  try {
    const fileUrl = await Uploader({
      location: 'aws_s3',
      file: video1[0],
      onProgress: (progress) => emitProgress(progress),
    });

    res.status(200).send({
      code: httpStatus.OK,
      message: 'File uploaded successfully!',
      fileUrl,
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to upload file.',
    });
  }
});


const updateUser = catchAsync(async (req, res) => {
  let user
  if (!(req.files && Object.keys(req.files).length >= 1)) {
    user = await userService.updateUserById(req.params.userId, req.body);
  } else {

    const { profilePicture, video1, video2, video3, video4 } = req.files;

    let uploadProgress = {
      video1: 0,
      video2: 0,
      video3: 0,
      video4: 0,
    };

    const emitProgress = async (fileType, progress) => {
      uploadProgress[fileType] = progress;
      try {
        await fetch('http://localhost:8080/upload-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadProgress),
        });
      } catch (error) {
        console.error('Error sending progress:', error);
      }
    };


    let profileLink = null;
    if (profilePicture) {
      profileLink = await Uploader({
        location: "aws_s3",
        file: profilePicture[0],
        sizeLimit: true,
      });
    }

    //2. Upload video content to user profile
    let videoUrl1 = null;
    let videoUrl2 = null;
    let videoUrl3 = null;
    let videoUrl4 = null;

    if (video1) {
      videoUrl1 = await Uploader({
        location: "aws_s3",
        file: video1[0],
        // sizeLimit: true,
        onProgress: (progress) => emitProgress('video1', progress),
      });
      // await Uploader({ location: "firebase", file: video1 });
    }
    if (video2) {
      // videoUrl2 = await Uploader({ location: "firebase", file: video2 });
      videoUrl2 = await Uploader({
        location: "aws_s3",
        file: video2[0],
        // sizeLimit: true,
        onProgress: (progress) => emitProgress('video2', progress),
      });
    }
    if (video3) {
      // videoUrl3 = await Uploader({ location: "firebase", file: video3 });
      videoUrl3 = await Uploader({
        location: "aws_s3",
        file: video3[0],
        // sizeLimit: true,
        onProgress: (progress) => emitProgress('video3', progress),
      });
    }
    if (video4) {
      // videoUrl4 = await Uploader({ location: "firebase", file: video4 });
      videoUrl4 = await Uploader({
        location: "aws_s3",
        file: video4[0],
        // sizeLimit: true,
        onProgress: (progress) => emitProgress('video4', progress),
      });
    }
    //-----------------------------------------------------------------------------
    const updatedUser = {
      ...req.body,
      profilePicture: profilePicture ? profileLink : req.body.profilePicture,
      video1: video1 ? videoUrl1 : req.body.video1,
      video2: video2 ? videoUrl2 : req.body.video2,
      video3: video3 ? videoUrl3 : req.body.video3,
      video4: video4 ? videoUrl4 : req.body.video4,
      // availability: req.body.availability === 'true' ? true : false
    };
    user = await userService.updateUserById(req.params.userId, updatedUser);
    console.log("asd: ", req.params.userId, req.body)

  }
  if (!user) {
    res.send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to update user !",
    });
    return;
  }
  res.send({
    code: httpStatus.OK,
    message: "User updated successfully !",
    user,
  });
});

const badgeCheck = catchAsync(async (req, res) => {
  const orderData = req.body;
  try {
    const user = await userService.getUserByEmail(orderData.billing.email)
    if (user) {
      orderData.line_items.forEach(async element => {
        if (element.product_id === 209) {
          let res = await userService.updateUserById(user.dataValues.id, {
            blueVerified: true
          });
          console.log("Result if Blue Badge: ", res.dataValues)
        }
        if (element.product_id === 214) {
          let res = await userService.updateUserById(user.dataValues.id, {
            goldVerified: true
          });
          console.log("Result if gold Badge: ", res.dataValues)
        }
      });
    }
  } catch (e) {
    console.log("error: ", e.message)
  }
  res.status(200).json({ message: 'Order data received successfully' });
})

const deleteUser = catchAsync(async (req, res) => {
  const { reason } = req.body;
  let userData = await userService.getUserById(req.params.userId)
  await userService.deleteUserById(req.params.userId);
  sendUserDeleteEmail('mail@jan-hein.com', userData.dataValues, reason)
  res
    .status(httpStatus.OK)
    .send({ code: httpStatus.OK, message: "User was succesfully deleted" });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserMoneySummary,
  badgeCheck,
  uploadFile
};
