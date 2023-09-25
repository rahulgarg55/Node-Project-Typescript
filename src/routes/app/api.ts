import express from 'express';
import { BadRequestResponse, SuccessResponse, InternalErrorResponse, NotFoundResponse } from '../../core/ApiResponse';
import { messages } from '../../core/messages';
import _ from 'lodash';
import { DepartmentModel } from '../../models/app/Department';
import { BadRequestError, NoDataError } from '../../core/ApiError';
import { paginate } from '../../utils/pagination';
import { EmployeeTypeModel } from '../../models/app/EmployeeType';
import { verifyToken } from '../../middleware/auth';

const router = express.Router()

/* Department EndPoints */

// To add departments
router.post('/department/', verifyToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        // Validated User input
        if (!(name)) {
            new BadRequestResponse(messages.FIELDS_REQUIRED).send(res);
        }
        // Validate if Deparment exist in our database
        const old_deparment = await DepartmentModel.findOne({ name: name, is_deleted: false });

        if (old_deparment) {
            new BadRequestResponse(messages.ALREADY_EXISTS).send(res);
        } else {
            // Create Department in our database
            const department = await DepartmentModel.create({
                name,
                description,
            });

            new SuccessResponse(messages.DEPARTMENT_ADDED, {
                result: _.pick(department, ['id', 'name', 'is_deleted', 'create_date', 'modify_date', 'description']),
            }).send(res);
        };
    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})

// Returns The list of Departments
router.get('/department/', verifyToken, async (req, res) => {
    try {
        const query = req.query ? req.query : {};
        const { previous, next, limit, startIndex, filter_query } = await paginate(DepartmentModel, query);
        const results = await DepartmentModel.find(filter_query).limit(limit).skip(startIndex).exec();
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


// Update Department
router.patch('/department/:id/', verifyToken, async (req, res) => {
    try {
        const department = await DepartmentModel.findById(req.params.id);
        if (!department) throw new BadRequestError(messages.NOT_FOUND);

        if (req.body.name) department.name = req.body.name;
        if (req.body.description) department.description = req.body.description;
        if (req.body.is_deleted) department.is_deleted = req.body.is_deleted;
        department.modify_date = new Date();
        department.save();

        new SuccessResponse(messages.SUCCESS, {
            result: department
        }).send(res);

    } catch (err) {
        console.log(err);
        new NotFoundResponse(messages.NOT_FOUND).send(res);
    }
})

/* Department EndPoints Ends */

/* ExmployeeTypes EndPoints */

router.post('/employee_type/', verifyToken, async (req, res) => {
    try {
        const { name } = req.body;
        if (!(name)) {
            new BadRequestResponse(messages.FIELDS_REQUIRED).send(res);
        }
        const old_employee_type = await EmployeeTypeModel.findOne({ name: name, is_deleted: false });
        if (old_employee_type) {
            new BadRequestResponse(messages.ALREADY_EXISTS).send(res);
        } else {
            const employee_type = await EmployeeTypeModel.create({
                name,
            });

            new SuccessResponse(messages.SUCCESS, {
                result: _.pick(employee_type, ['id', 'name', 'is_deleted', 'create_date']),
            }).send(res);
        };
    } catch (err) {
        console.log(err);
        new InternalErrorResponse(messages.TRY_LATER).send(res);
    }
})


router.get('/employee_type/', verifyToken, async (req, res) => {
    try {
        const query = req.query ? req.query : {};
        const { previous, next, limit, startIndex, filter_query } = await paginate(EmployeeTypeModel, query);
        const results = await EmployeeTypeModel.find(filter_query).limit(limit).skip(startIndex).exec();
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

router.patch('/employee_type/:id/', verifyToken, async (req, res) => {
    try {
        const employee_type = await EmployeeTypeModel.findById(req.params.id);
        if (!employee_type) throw new BadRequestError(messages.NOT_FOUND);
        if (req.body.name) employee_type.name = req.body.name;
        if (req.body.is_deleted) employee_type.is_deleted = req.body.is_deleted;
        employee_type.modify_date = new Date();
        employee_type.save();

        new SuccessResponse(messages.SUCCESS, {
            result: employee_type
        }).send(res);

    } catch (err) {
        console.log(err);
        new NotFoundResponse(messages.NOT_FOUND).send(res);
    }
})

/* ExmployeeTypes EndPoints Ends */


export default router;
