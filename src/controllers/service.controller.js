const ServiceModel = require('~/models/service.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    getAllService: asyncUtil(async (req, res) => {
        const listOfService = await ServiceModel.find({});
        return AppResponse.success(req, res)(listOfService);
    }),
    createService: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const service = await ServiceModel.create(data);
        return AppResponse.success(req, res)(service);
    }),
    updateService: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const service = await ServiceModel.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            data,
            { new: true }
        ).exec();
        return AppResponse.success(req, res)(service);
    }),
    removeService: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const service = data.map(async (item) => {
            return await ServiceModel.findByIdAndDelete({
                _id: item,
            }).exec();
        });
        const response = await Promise.all(service);
        return AppResponse.success(req, res)(response, 'Delete successfully');
    }),
};
