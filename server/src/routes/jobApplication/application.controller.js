const fs = require('fs');
const applicationModel = require('../../models/jobApplication.model');
const jobModel = require('../../models/job.model')

async function addApplication(req, res) {
    try {
        const application = new applicationModel({
            ...req.body,
            user: req.user.id,
        });
    
        const job = await jobModel.findById(req.body.jobId);
        application.employer = job.createdBy;
    
        if (req.file) {
            application.resume = {
                name: req.file.filename,
                data: fs.readFileSync(req.file.path),
                contentType: 'application/pdf'
            }
            const job = await jobModel.findById(req.body.jobId);
            application.employer = job.createdBy;
            await application.save();
            //   delete the uploaded file from the local disc
            fs.unlinkSync(req.file.path);
    
            return res.status(201).json({ ...application.toObject(), resume: req.file.filename });
        }
        return res.status(400).json({ error: 'Can not create application' });
    } catch(error)  {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    
}


async function getApplications(req, res) {
    try {
        if (req.user.role === 'admin') {
            const applications = await applicationModel.find();
            return res.status(200).json(applications);
        } else if (req.user.role === 'employer') {
            const applications = await applicationModel.find({employer: req.user.id});
            return res.status(200).json(applications);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getApplication(req, res) {
    try {
      const { id } = req.params;

      if(req.user.role === 'admin') {
        const application = await applicationModel.findById(id);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
          }
          return res.status(200).json(application);
      } else if(req.user.role === 'employer') {
        const application = await applicationModel.findOne({employer: req.user.id, _id: id});
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
          }
          return res.status(200).json(application);
      }
      
    } catch (error) {
      console.log(error.stack);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = {
    addApplication,
    getApplications,
    getApplication
}