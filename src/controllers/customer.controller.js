const CustomerModel = require('~/models/customer.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    getAllCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel.find({});
        return AppResponse.success(req, res)(customer);
    }),
    addCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel(req.body).save();
        return AppResponse.success(req, res)(customer);
    }),
    editCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        ).exec();
        return AppResponse.success(req, res)(customer);
    }),
    deleteCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel.findOneAndDelete({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(customer);
    }),
    detailCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel.findOne({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(customer);
    }),
};
