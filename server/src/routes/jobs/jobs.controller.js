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
    try {
        const { id }= req.params;
        const job = await jobModel.findById(id);
        if (job && job.status === 'published') {
            return res.status(200).json(job);
        }
        res.status(404).json({error: 'Job not found'});
    } catch (err) {
        console.log(err.stack)
        return res.status(404).json({error: 'Job not found'});
    }
}

async function getEmployerJobs(req, res) {
    try {
        if (req.user.role === 'admin') {
            const employerId = req.params.employerId
            if (!employerId) {
                return res.status(400).json( {err: 'Invalid request'} )
            }
            const employerJobs = await jobModel.find({createdBy: employerId})
            return res.status(200).json(employerJobs);

        } else if (req.user.role === 'employer') {
            const employerId = req.user.id;
            const employerJobs = await jobModel.find({createdBy: employerId})
            return res.status(200).json(employerJobs);
        }
       
    } catch (err) {
        return res.status(400).json({error: 'Invalid request'});
    }
}

async function getEmployerJob(req, res) {

}



module.exports = {
    addJob,
    getJobs,
    getJob,
    getEmployerJobs,
    getEmployerJob
}