const formInterface = {
  name: "",
  lastname: "",
  fullname: "",
  description: "",
  workstation: [],
  social: {
    email: "",
    facebook: "",
    x: "",
    instagram: "",
    youtube: "",
    github: "",
    linkedin: "",
  },
  skills: [],
  jobsHistory: [
    /* { name: "", job: [], ubication: "", type: "", time: "", dateStart: "", dateEnd: "" } */
  ],
  educationHistory: [
    /* { name: "", title: "", ubication: "", dateStart: "", dateEnd: "" } */
  ],
  certificationsHistory: [
    /* { name: "", company: "", date: "", link: "" } */
  ],
};

const jobInterface = {
  name: "",
  ubication: "",
  type: "",
  time: "",
  dateStart: "",
  dateEnd: "",
  job: [],
  jobInput: "",
};

const educationInterface = {
  name: "",
  title: "",
  ubication: "",
  dateStart: "",
  dateEnd: "",
};

const certificationInterface = {
  name: "",
  company: "",
  date: "",
  link: "",
};

export { formInterface, jobInterface, educationInterface, certificationInterface };
