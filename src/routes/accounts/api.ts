import express from 'express';
import { Orgs, UserModel } from '../../models/accounts/User';
import {
    AuthFailureResponse,
    BadRequestResponse,
    SuccessResponse,
    InternalErrorResponse,
    NotFoundResponse,
    SuccessMsgResponse
} from '../../core/ApiResponse';
import { messages } from '../../core/messages';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { jwt_secret, token_expires_in } from '../../config';
import { UserTokenModel } from '../../models/accounts/UserToken';
import _ from 'lodash';
import { BadRequestError } from '../../core/ApiError';
import { AddressModel } from '../../models/accounts/Address';
import { paginate } from '../../utils/pagination';
import { verifyToken } from '../../middleware/auth';
import { DepartmentModel } from '../../models/app/Department';
import { EmployeeTypeModel } from '../../models/app/EmployeeType';
import { storage, fileFilter } from '../../utils/fileUpload';
import multer from 'multer';
import { UserDocumentsModel } from '../../models/accounts/UserDocuments';
import { setUploadfileUrl } from '../../utils/utils';
import { AttendanceModel, LeaveType } from '../../models/accounts/Attendance';
import { AppraisalModel } from '../../models/accounts/Appraisal';
import { SalaryModel } from '../../models/accounts/Salary';

const router = express.Router()

// For uploading files
const fileUpload = multer({ storage: storage, fileFilter: fileFilter });
// const imageUpload = multer({storage: storage, fileFilter : imageFilter});


// Register User
router.post('/signup/', async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirm_password, is_staff } = req.body;
        // Validated User input
        if (!(first_name && last_name && email && password && confirm_password)) {
            new BadRequestResponse(messages.FIELDS_REQUIRED).send(res);
        }
        if (!(/@odzservices.com\s*$/.test(email.trim())) && !(/@ourdesignz.com\s*$/.test(email.trim()))) new BadRequestResponse(messages.NOT_EMPLOYEE).send(res);

        //Check & Encrypt user password
        if (password !== confirm_password) new BadRequestResponse(messages.PASSWORD_NE_CONFIRM_PASS).send(res);
        // Validate if user exist in our database
        var email_lower = email.toLowerCase()
        const oldUser = await UserModel.findOne({ email: email_lower });
        if (oldUser) {
            new BadRequestResponse(messages.USER_ALREADY_EXISTS).send(res);
        } else {
            const encryptedPassword = await bcrypt.hash(password, 15);

            // Create user in our database
            const user = await UserModel.create({
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                email: email.toLowerCase(),
                password: encryptedPassword,
                is_staff: is_staff ? is_staff : false,
                department: req.body.department,
                organisation: ((/@odzservices.com\s*$/.test(email.trim()))) ? Orgs.ODZSERVICES : Orgs.OURDESIGNZ
            });

            // Create token
            const token = jwt.sign(
                { user_id: user.id, email },
                jwt_secret,
                {
                    expiresIn: `${token_expires_in}d`,
                }
            );
            await UserTokenModel.create({
                user,
                access_token: token,
                expires_in: token_expires_in,
            });
            
            new SuccessResponse(messages.SIGNUP_SUCCESS, {
                result: _.pick(user, ['id', 'first_name', 'last_name', 'email', 'is_deleted', 'is_staff', 'mobile_number', 'personal_email', 'is_superuser']),
                access_token: token,
            }).send(res);
        }
        // Our register logic ends here
    } catch (err) {
        console.log(err);
    }
})
// Registration ends

// LogIn

router.post('/login/', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) new BadRequestResponse(messages.FIELDS_REQUIRED).send(res);

        // Validate if user exist in our database
        const user = await UserModel.findOne({ email: email.toLowerCase() }, ['first_name', 'last_name', "is_staff", 'mobile_number', 'personal_email', 'is_superuser']).select('password');
        if (user && user.is_deleted) new AuthFailureResponse(messages.USER_ACCOUNT_NOT_ACTIVE);
        if (!user) new AuthFailureResponse(messages.USER_NOT_FOUND);
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user.id, email },
                jwt_secret,
                {
                    expiresIn: `${token_expires_in}d`,
                }
            );
            await UserTokenModel.create({
                user,
                access_token: token,
                expires_in: token_expires_in,
            });

            new SuccessResponse(messages.LOGGED_IN, {
                result: _.pick(user, ['id', 'first_name', 'last_name', 'email', 'mobile_number', 'is_staff', 'personal_email', 'is_superuser']),
                access_token: token,
            }).send(res);
        } else {
            new BadRequestResponse(messages.PASSWORD_MISMATCH).send(res);
        }

    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})
// Login Ends


// Employee/User Endpoints

// Employee/User list
router.get('/employees/', verifyToken, async (req, res) => {
    try {
        const query = req.query ? req.query : {};
        const { previous, next, limit, startIndex, filter_query } = await paginate(UserModel, query);
        filter_query._id = { $ne: req.user.user_id };
        if (filter_query.organisation) {
            var regex = new RegExp(filter_query.organisation);
            filter_query.organisation = { $regex: regex, $options: "i" };
        }
        const results = await UserModel.find(filter_query).populate(['department', 'employee_type']).sort('-_id').limit(limit).skip(startIndex).exec();
        const departments = await DepartmentModel.find({ is_deleted: false }, { 'name': 1, 'id': 1 });
        const employee_type = await EmployeeTypeModel.find({ is_deleted: false }, { 'name': 1, 'id': 1 });
        new SuccessResponse(messages.SUCCESS, {
            previous: previous,
            next: next,
            results: results,
            departments: departments,
            employee_type: employee_type
        }).send(res);
    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})


router.post('/employee/', async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        if (!(first_name && last_name && email)) {
            new BadRequestResponse(messages.FIELDS_REQUIRED).send(res);
        }
        let searchRegex = new RegExp(email, 'i');
        const oldUser = await UserModel.findOne({ email: searchRegex, is_deleted: false });
        if (!(/@odzservices.com\s*$/.test(email.trim())) && !(/@ourdesignz.com\s*$/.test(email.trim()))) {
            new BadRequestResponse(messages.NOT_EMPLOYEE).send(res);
        } else if (oldUser) {
            new BadRequestResponse(messages.USER_ALREADY_EXISTS).send(res);
        } else {
            const user = await UserModel.create(req.body);
            new SuccessResponse(messages.SUCCESS, {
                result: _.pick(user, ['id', 'first_name', 'last_name', 'email', 'is_deleted', 'is_staff'])
            }).send(res);
        }
    } catch (err) {
        console.log("Error :", err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})


router.patch('/profile/:id/', verifyToken, async (req, res) => {
    try {
        const { email } = req.body;
        let searchRegex = new RegExp(email, 'i');
        var anotherUser;
        if (email) anotherUser = await UserModel.findOne({ _id: { $ne: req.params.id }, email: searchRegex });
        if (anotherUser) {
            new BadRequestResponse(messages.EMAIL_UNAVAILABLE).send(res);
        } else {
            req.body.organisation = ((/@odzservices.com\s*$/.test(email.trim()))) ? Orgs.ODZSERVICES : Orgs.OURDESIGNZ;
            const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            new SuccessResponse(messages.SUCCESS, {
                result: _.pick(user, ['id', 'first_name', 'last_name', 'email', 'mobile_number', 'is_staff', 'personal_email']),
            }).send(res);
        }
    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})

// Employee/User Details
router.get('/profile/:id/', verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        const departments = await DepartmentModel.find({ is_deleted: false }, { 'name': 1, 'id': 1 });
        const employee_type = await EmployeeTypeModel.find({ is_deleted: false }, { 'name': 1, 'id': 1 });
        new SuccessResponse(messages.SUCCESS, {
            result: user,
            departments: departments,
            employee_types: employee_type,
        }).send(res);

    } catch (err) {
        console.log("Error :", err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})
// Employee/User Endpoints ends


// User Password Endpoint

router.patch('/change_password/:id/', verifyToken, async (req, res) => {
    try {
        const { password, confirm_password } = req.body;
        if (!(password && confirm_password)) {
            return new BadRequestResponse(messages.FIELDS_REQUIRED).send(res);
        } else if (password.length < 8) {
            return new BadRequestResponse(messages.PASSWORD_TOO_SHORT).send(res);
        } else if (password !== confirm_password) {
            return new BadRequestResponse(messages.PASSWORD_NE_CONFIRM_PASS).send(res);
        }
        else {
            const encryptedPassword = await bcrypt.hash(password, 15);
            const user = await UserModel.findById(req.params.id);
            if (user) {
                user.password = encryptedPassword;
                user.save();
                return new SuccessResponse(messages.PASSWORD_CHANGED, {
                    result: _.pick(user, ['id', 'first_name', 'last_name', 'email', 'is_deleted', 'is_staff'])
                }).send(res);
            } else {
                return new BadRequestResponse(messages.USER_NOT_FOUND).send(res)
            }
        }
    } catch (err) {
        console.log("Error :", err);
        return new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})

// user password endpoint ends


/* Users Address EndPoints */

router.post('/address/', verifyToken, async (req, res) => {
    try {
        const { user, address, pincode, country, state, city } = req.body;
        if (!(user || address || pincode || country || state || city)) {
            new BadRequestResponse(messages.FIELDS_REQUIRED).send(res);
        } else {
            const address = await AddressModel.create(req.body);

            new SuccessResponse(messages.SUCCESS, {
                result: address,
            }).send(res);
        };
    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})


router.get('/address/', verifyToken, async (req, res) => {
    try {
        const query = req.body ? req.body : {};
        const { previous, next, limit, startIndex, filter_query } = await paginate(AddressModel, query);
        const results = await AddressModel.find(filter_query).populate(['user', 'country', 'state']).limit(limit).skip(startIndex).exec();
        new SuccessResponse(messages.SUCCESS, {
            previous: previous,
            next: next,
            results: results
        }).send(res);
    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})

router.patch('/address/:id/', verifyToken, async (req, res) => {
    try {
        const address = await AddressModel.findById(req.params.id);
        if (!address) throw new BadRequestError(messages.NOT_FOUND);

        if (req.body.address) address.address = req.body.address;
        if (req.body.pincode) address.pincode = req.body.pincode;
        if (req.body.country) address.country = req.body.country;
        if (req.body.state) address.state = req.body.state;
        if (req.body.city) address.city = req.body.city;
        if (req.body.is_deleted) address.is_deleted = req.body.is_deleted;
        address.modify_date = new Date();
        address.save();

        new SuccessResponse(messages.SUCCESS, {
            result: address
        }).send(res);

    } catch (err) {
        console.log(err);
        new NotFoundResponse(messages.NOT_FOUND).send(res);
    }
})

/* User Address EndPoints Ends */

/* User Documents Upload view */

const upload = fileUpload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'joining_letter', maxCount: 1 },
    { name: 'relieving', maxCount: 1 },
    { name: 'salary_slip_1', maxCount: 1 },
    { name: 'salary_slip_2', maxCount: 1 },
    { name: 'salary_slip_3', maxCount: 1 },
    { name: 'appraisal', maxCount: 1 },
    { name: 'permanent_address', maxCount: 1 },
    { name: 'local_address', maxCount: 1 },
    { name: 'pan_card', maxCount: 1 },
    { name: 'metric_grade', maxCount: 1 },
    { name: 'senior_secondary', maxCount: 1 },
    { name: 'graduation', maxCount: 1 },
    { name: 'post_graduation', maxCount: 1 },
])


router.post('/documents/:id/', upload, verifyToken, async (req, res) => {
    try {
        var document = await UserDocumentsModel.findOne({ user: req.params.id })
        if (!document) document = await UserDocumentsModel.create({ user: req.params.id })
        if (req.files['photo']) document.photo = setUploadfileUrl(req.files['photo']);
        if (req.files['joining_letter']) document.joining_letter = setUploadfileUrl(req.files['joining_letter']);
        if (req.files['relieving']) document.relieving = setUploadfileUrl(req.files['relieving']);
        if (req.files['salary_slip_1']) document.salary_slip_1 = setUploadfileUrl(req.files['salary_slip_1']);
        if (req.files['salary_slip_2']) document.salary_slip_2 = setUploadfileUrl(req.files['salary_slip_2']);
        if (req.files['salary_slip_3']) document.salary_slip_3 = setUploadfileUrl(req.files['salary_slip_3']);
        if (req.files['appraisal']) document.appraisal = setUploadfileUrl(req.files['appraisal']);
        if (req.files['permanent_address']) document.permanent_address = setUploadfileUrl(req.files['permanent_address']);
        if (req.files['local_address']) document.local_address = setUploadfileUrl(req.files['local_address']);
        if (req.files['pan_card']) document.pan_card = setUploadfileUrl(req.files['pan_card']);
        if (req.files['metric_grade']) document.metric_grade = setUploadfileUrl(req.files['metric_grade']);
        if (req.files['senior_secondary']) document.senior_secondary = setUploadfileUrl(req.files['senior_secondary']);
        if (req.files['graduation']) document.graduation = setUploadfileUrl(req.files['graduation']);
        if (req.files['post_graduation']) document.post_graduation = setUploadfileUrl(req.files['post_graduation']);
        document.modify_date = new Date();

        document.save()

        new SuccessResponse(messages.SUCCESS, {
            result: document,
        }).send(res);
    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})

router.get('/documents/:id/', verifyToken, async (req, res) => {
    try {
        const document = await UserDocumentsModel.findOne({ user: req.params.id });

        new SuccessResponse(messages.SUCCESS, {
            result: document,
        }).send(res);

    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})

/* User Documents upload view ends */


/* User Attendance views */
// :id is user id of whom we fetching/creating attendance

router.post('/attendance/:id/', verifyToken, async (req, res) => {
    try {
        const { date } = req.body;
        if (!(date)) {
            return new BadRequestResponse(messages.FIELDS_REQUIRED).send(res);
        } else {
            const attendance = await AttendanceModel.create(req.body);
            attendance.user = req.params.id;
            attendance.save();
            new SuccessResponse(messages.SUCCESS, {
                result: attendance,
            }).send(res);
        }
    } catch (err) {
        console.log(err)
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})

router.get('/attendance/:id/', verifyToken, async (req, res) => {
    try {
        const attendance = await AttendanceModel.find({ user: req.params.id }).sort('-_id').limit(30);
        const full_day_leaves = await AttendanceModel.find({ user: req.params.id, leave_type: LeaveType.FULL_DAY }).countDocuments();
        const half_day_leaves = await AttendanceModel.find({ user: req.params.id, leave_type: LeaveType.HALF_DAY }).countDocuments();
        const sick_leaves = await AttendanceModel.find({ user: req.params.id, leave_type: LeaveType.SICK }).countDocuments();
        const urgent_leaves = await AttendanceModel.find({ user: req.params.id, leave_type: LeaveType.URGENT }).countDocuments();

        new SuccessResponse(messages.SUCCESS, {
            result: attendance,
            full_day_leaves: full_day_leaves,
            half_day_leaves: half_day_leaves,
            sick_leaves: sick_leaves,
            urgent_leaves: urgent_leaves,
        }).send(res);

    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})

/* User Attendance views ends */

/* User Appraisals views */
// :id is user id of whom we fetching/creating appraisal

router.post('/appraisal/:id/', verifyToken, async (req, res) => {
    try {
        const { due_date, increment_grade, increment_percentage } = req.body;
        if (!(due_date || increment_grade || increment_percentage)) {
            return new BadRequestResponse(messages.FIELDS_REQUIRED).send(res);
        } else {
            const appraisal = await AppraisalModel.create(req.body);
            appraisal.user = req.params.id;
            appraisal.save();
            new SuccessResponse(messages.SUCCESS, {
                result: appraisal,
            }).send(res);
        }
    } catch (err) {
        console.log(err)
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})


router.get('/appraisal/:id/', verifyToken, async (req, res) => {
    try {
        const appraisal = await AppraisalModel.find({ user: req.params.id }).sort('-_id').limit(30);

        new SuccessResponse(messages.SUCCESS, {
            result: appraisal,
        }).send(res);

    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})

/* User Appraisals views ends */

/* User Salary views */
// :id is user id of whom we fetching/creating Salary

router.post('/salary/:id/', verifyToken, async (req, res) => {
    try {
        const { working_days, days_worked, ctc, net_payble_salary } = req.body
        if (!(working_days || days_worked || ctc || net_payble_salary)) {
            return new BadRequestResponse(messages.FIELDS_REQUIRED).send(res);
        } else {
            const salary = await SalaryModel.create(req.body);
            salary.user = req.params.id;
            salary.save();
            new SuccessMsgResponse(messages.SUCCESS).send(res);
        }
    } catch (err) {
        console.log(err)
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})


router.get('/salary/:id/', verifyToken, async (req, res) => {
    try {
        const salaries = await SalaryModel.find({ user: req.params.id }).sort('-_id').limit(12);

        new SuccessResponse(messages.SUCCESS, {
            result: salaries,
        }).send(res);

    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})


router.patch('/salary/:id/:salary_id/', verifyToken, async (req, res) => {
    try {
        const salary = await SalaryModel.findById(req.params.salary_id);
        if (!salary) throw new BadRequestError(messages.NOT_FOUND);
        if (req.body.deposited) salary.deposited = req.body.deposited;
        if (req.body.emf) salary.emf = req.body.emf;
        if (req.body.status) salary.status = req.body.status;
        salary.modify_date = new Date();
        salary.save();
        new SuccessMsgResponse(messages.SUCCESS).send(res);
    } catch (err) {
        console.log(err);
        new NotFoundResponse(messages.NOT_FOUND).send(res);
    }
})

/* User Salary views ends */



export default router;
