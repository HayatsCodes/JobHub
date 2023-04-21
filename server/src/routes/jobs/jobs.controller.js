 const jobModel = require('../../models/job.model')

 async function addJob(req, res) {
    try {
        const job = new jobModel({
            ...req.body,
            createdBy: req.user.id
        });
        await job.save();
        res.status(201).json(job);
    } catch(err) {
        console.log(err.stack)
        return res.status(400).json({error: 'Invalid job'});
    }
}

async function getJobs(req, res) {
    try {
        const jobs = await jobModel.find({status: 'published'});
        res.status(200).json(jobs);
    } catch (err) {
        console.log(err.stack)
        return res.status(400).json({error: 'Encountered an error'});
    }
}

async function getJob(req, res) {

}



module.exports = {
    addJob,
    getJobs,
    getJob
}