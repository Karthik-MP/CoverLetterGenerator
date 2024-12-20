// const CoverLetter = require("../models/CoverLetter");
const scrapeJobDetails = require("../services/scraperService");
const { chatgpt, geminiModel } = require("../services/GenAIProvidersService");
const generatePDF = require("../utils/pdfGenerator");

exports.createCoverLetter = async (req, res) => {
  const { jobUrl } = req.body;

  try {
    // Step 1: Scrape job details
    const jobDetails = await scrapeJobDetails(jobUrl);
    if (!jobDetails)
      return res.status(400).json({ error: "Failed to scrape job details" });
    
    const existingCoverLetter =
      "I am writing to express my enthusiasm for the Software Engineering Internship at Xometry. As a Masters student in Computer Science at SUNY Binghamton University, and with a Bachelors degree from GITAM University in India, I am eager to apply my academic background and software development experience to make a meaningful impact at your innovative company.During my time as a Software Engineer at Virtusa Consulting Services, I gained hands-on experience designing and developing scalable software solutions. This experience honed my technical skills while fostering strong collaboration with cross-functional teams to address complex challenges. I developed proficiency in version control, debugging, and code optimization, all of which align with the core responsibilities of the internship. Furthermore, I collaborated on high-stakes projects and was actively involved in the end-to-end development lifecycle, which has given me a strong foundation for contributing to Xometrys platform. My academic projects in machine learning and data processing have enhanced my problem-solving abilities and my adaptability in fast-paced environments. I am excited by the prospect of applying these skills to real-world challenges at Xometry, where I can contribute to the design, development, and testing of scalable software solutions. In addition to my technical capabilities, I am committed to continuous learning and professional growth. The opportunity to be mentored by experienced professionals and participate in Xometrys dynamic, collaborative environment excites me. I am particularly drawn to the entrepreneurial spirit at Xometry, as it mirrors my own passion for problem-solving and driving impactful results.I am confident that my skills, work ethic, and enthusiasm make me a great fit for this internship. I am available to work full-time during the summer internship period and am eager to contribute to Xometrys mission to connect innovative people with cutting-edge manufacturing solutions. I look forward to the opportunity to discuss how my background aligns with the needs of your team. Thank you for considering my application. I am excited about the possibility of contributing to Xometrys continued success.";

    const my_technical_skills =
      "Programming Languages: Java, Python, JavaScript (Node.js)  Data Science Libraries and Tools: NumPy, Pandas, Scikit-learn, Seaborn, OpenCV, Matplotlib, Tableau Web Dev Technologies: HTML5, CSS3, Bootstrap, PHP, JavaScript, React.js, Angular, Next.js, Tailwind CSS, Spring Boot Tools & Platforms: GitHub, SonarQube, SQL, NoSql, MongoDB, AWS, Google Cloud, JUnit, Postman, Adobe Analytics";

    // Step 2: Generate cover letter with OpenAI
    const prompt = `
          Extract the following details from the job description and previous cover letter:

          **From Job Description:**
          - Company Name:
          - Role:
          - Category (e.g., Full-time, Part-time, Remote):
          - Location:
          - Flexibility (e.g., remote, hybrid):
          - Salary:

          **From Previous Cover Letter:**
          - Description (Only the body of the cover letter, excluding the header and footer):

          **Job title:**
          ${jobDetails.title}

          **Job Description:**
          ${jobDetails.description}

          **Existing Cover Letter:**
          ${existingCoverLetter}

          **Technical Skill I have:**
          ${my_technical_skills}

          Please provide the extracted fields in a structured format like below:

          **Job Description Details:**
          - Company Name: 
          - Role: 
          - Category: 
          - Location: 
          - Flexibility: 
          - Salary: 

          **Cover Letter Body:**
          {Extracted body of the cover letter here}
          `;

    const modelType = process.env.LLM_MODEL_TYPE;
    let response;

    switch (modelType.toLowerCase()) {
      case "openai":
        console.log("Using OpenAI model...");
        response = await chatgpt(prompt);
        break;
      case "gemini":
        console.log("Using Gemini model...");
        response = await geminiModel(prompt);
        break;
      // case "llama":
      //   console.log("Using Llama model...");
      //   response = await llamaModel(prompt);
      //   break;
      // case "ollama":
      //   console.log("Using Ollama model...");
      //   response = await ollamaModel(prompt); // Assuming the Ollama model function is defined
      //   break;
      // case "claude":
      //   console.log("Using Claude model...");
      //   response = await claudeModel(prompt); // Assuming the Claude model function is defined
      //   break;
      default:
        throw new Error("Unsupported model type in LLM_MODEL_TYPE");
    }

    console.log(response);
    const extractedDetails = extractCoverLetterDetails(response);
  //   const extractedDetails = {
  // "companyName": 'MKS Instruments',
  // role: 'Software Engineering Co-op',
  // category: 'Co-op',
  // location: 'Onsite (Specific location not provided in the job description)',
  // flexibility: 'No remote or hybrid work arrangement.',
  // salary: '$25.00 per hour',
  // coverLetterBody: '**\n' +
  //   "I am writing to express my enthusiasm for the Software Engineering Internship at Xometry."};
    console.log(extractedDetails?.coverLetterBody);
    // Step 4: Generate PDF
    const fileName = `Karthik_Maganahalli_Prakash_cover_letter_${extractedDetails.companyName}.pdf`;
    const personal = {
      name: "Karthik Maganahalli Prakash",
      address: "209 Main Street",
      city: "Binghamton",
      state: "NY",
      zip: "13905",
      phone: "+1 (607) 774-7451",
      email: "karthikmp521@gmail.com",
      linkeIn: "https://www.linkedin.com/in/Karthik-mp/",
      website: "https://www.Karthikmp.com",
    };

    await generatePDF(
      personal,
      extractedDetails?.coverLetterBody,
      `./${fileName}`
    );

    res.status(200).json({
      message: "Cover letter generated successfully",
      coverLetterBody:extractedDetails?.coverLetterBody,
      pdfUrl: fileName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Define a function to extract information from the cover letter
function extractCoverLetterDetails(coverLetter) {
  // Initialize an object to store extracted details
  const extractedDetails = {
    companyName: null,
    role: null,
    category: null,
    location: null,
    flexibility: null,
    salary: null,
    coverLetterBody: null,
  };

  // Regular expressions to capture each field from the cover letter
  const companyNameRegex = /Company Name:\s*(.*)/i;
  const roleRegex = /Role:\s*(.*)/i;
  const categoryRegex = /Category:\s*(.*)/i;
  const locationRegex = /Location:\s*(.*)/i;
  const flexibilityRegex = /Flexibility:\s*(.*)/i;
  const salaryRegex = /Salary:\s*(.*)/i;
  const coverLetterBodyRegex = /\*\*Cover Letter Body\:\*\*\s*([\s\S]*)/i;

  // Match the fields and store them in the extractedDetails object
  const companyNameMatch = coverLetter.match(companyNameRegex);
  const roleMatch = coverLetter.match(roleRegex);
  const categoryMatch = coverLetter.match(categoryRegex);
  const locationMatch = coverLetter.match(locationRegex);
  const flexibilityMatch = coverLetter.match(flexibilityRegex);
  const salaryMatch = coverLetter.match(salaryRegex);
  const coverLetterBodyMatch = coverLetter.match(coverLetterBodyRegex);

  if (companyNameMatch)
    extractedDetails.companyName = companyNameMatch[1].trim();
  if (roleMatch) extractedDetails.role = roleMatch[1].trim();
  if (categoryMatch) extractedDetails.category = categoryMatch[1].trim();
  if (locationMatch) extractedDetails.location = locationMatch[1].trim();
  if (flexibilityMatch)
    extractedDetails.flexibility = flexibilityMatch[1].trim();
  if (salaryMatch) extractedDetails.salary = salaryMatch[1].trim();
  if (coverLetterBodyMatch)
    extractedDetails.coverLetterBody = coverLetterBodyMatch[1].trim();

  return extractedDetails;
}
