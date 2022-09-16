const CustomerModel = require('~/models/customer.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    getAllCustomer: asyncUtil(async (req, res) => {
        try {
            const customer = await CustomerModel.find({});
            return AppResponse.success(req, res)(customer);
        } catch (error) {
            return AppResponse.fail(req, res)(error);
        }
    }),
    addCustomer: asyncUtil(async (req, res) => {
        try {
            const customer = await CustomerModel(req.body).save();
            return AppResponse.success(req, res)(customer);
        } catch (error) {
            return AppResponse.fail(req, res)(error);
        }
    }),
    editCustomer: asyncUtil(async (req, res) => {
        try {
            const customer = await CustomerModel.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true }
            ).exec();
            return AppResponse.success(req, res)(customer);
        } catch (error) {
            return AppResponse.fail(req, res)(error);
        }
    }),
    deleteCustomer: asyncUtil(async (req, res) => {
        try {
            const customer = await CustomerModel.findOneAndDelete({
                _id: req.params.id,
            }).exec();
            return AppResponse.success(req, res)(customer);
        } catch (error) {
            return AppResponse.fail(req, res)({ message: 'Not Found' });
        }
    }),
    detailCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel.findOne({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(customer);
    }),
};
