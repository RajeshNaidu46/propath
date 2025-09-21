export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Assessment {
  id: string
  title: string
  category: string
  duration: string
  questions: Question[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  description: string
  skills: string[]
}

// Top 50 IT Roles with 25 MCQ questions each
export const itRoleAssessments: Assessment[] = [
  {
    id: "full-stack-developer",
    title: "Full Stack Developer",
    category: "Development",
    duration: "45 min",
    difficulty: "Intermediate",
    description: "Comprehensive assessment covering frontend, backend, and database technologies",
    skills: ["JavaScript", "React", "Node.js", "Databases", "APIs"],
    questions: [
      {
        id: 1,
        question: "Which of the following is NOT a JavaScript framework?",
        options: ["React", "Angular", "Vue.js", "Django"],
        correctAnswer: 3,
        explanation: "Django is a Python web framework, not a JavaScript framework.",
      },
      {
        id: 2,
        question: "What does REST stand for in web APIs?",
        options: [
          "Representational State Transfer",
          "Remote State Transfer",
          "Relational State Transfer",
          "Responsive State Transfer",
        ],
        correctAnswer: 0,
        explanation: "REST stands for Representational State Transfer, an architectural style for web services.",
      },
      {
        id: 3,
        question: "Which HTTP method is used to update existing data?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: 2,
        explanation: "PUT is typically used to update existing resources in RESTful APIs.",
      },
      {
        id: 4,
        question: "What is the purpose of middleware in Express.js?",
        options: ["Database connection", "Request/Response processing", "File storage", "User authentication only"],
        correctAnswer: 1,
        explanation: "Middleware functions execute during the request-response cycle to process requests.",
      },
      {
        id: 5,
        question: "Which database type is MongoDB?",
        options: ["Relational", "NoSQL Document", "Graph", "Key-Value"],
        correctAnswer: 1,
        explanation: "MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents.",
      },
      // Adding 20 more questions for Full Stack Developer
      {
        id: 6,
        question: "What is the Virtual DOM in React?",
        options: ["A real DOM element", "A JavaScript representation of the real DOM", "A database", "A server"],
        correctAnswer: 1,
        explanation:
          "Virtual DOM is a JavaScript representation of the real DOM kept in memory and synced with the real DOM.",
      },
      {
        id: 7,
        question: "Which CSS property is used for responsive design?",
        options: ["display", "position", "media queries", "float"],
        correctAnswer: 2,
        explanation: "Media queries allow CSS to adapt to different screen sizes and devices.",
      },
      {
        id: 8,
        question: "What is the purpose of package.json in Node.js?",
        options: ["Store user data", "Manage project dependencies", "Configure database", "Handle routing"],
        correctAnswer: 1,
        explanation: "package.json manages project metadata and dependencies in Node.js projects.",
      },
      {
        id: 9,
        question: "Which of these is a JavaScript runtime environment?",
        options: ["React", "Angular", "Node.js", "Bootstrap"],
        correctAnswer: 2,
        explanation: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
      },
      {
        id: 10,
        question: "What does CORS stand for?",
        options: [
          "Cross-Origin Resource Sharing",
          "Cross-Origin Request Security",
          "Cross-Origin Response System",
          "Cross-Origin Resource Security",
        ],
        correctAnswer: 0,
        explanation:
          "CORS stands for Cross-Origin Resource Sharing, a mechanism that allows restricted resources to be requested from another domain.",
      },
      {
        id: 11,
        question: "Which SQL command is used to retrieve data?",
        options: ["INSERT", "UPDATE", "DELETE", "SELECT"],
        correctAnswer: 3,
        explanation: "SELECT is used to query and retrieve data from database tables.",
      },
      {
        id: 12,
        question: "What is the purpose of Git in software development?",
        options: ["Database management", "Version control", "Web hosting", "Code compilation"],
        correctAnswer: 1,
        explanation: "Git is a distributed version control system for tracking changes in source code.",
      },
      {
        id: 13,
        question: "Which HTML5 element is used for navigation?",
        options: ["<div>", "<nav>", "<section>", "<header>"],
        correctAnswer: 1,
        explanation: "<nav> is the semantic HTML5 element specifically designed for navigation links.",
      },
      {
        id: 14,
        question: "What is the difference between let and var in JavaScript?",
        options: ["No difference", "let has block scope, var has function scope", "var is newer", "let is faster"],
        correctAnswer: 1,
        explanation: "let has block scope while var has function scope, making let safer to use.",
      },
      {
        id: 15,
        question: "Which CSS framework is known for utility-first approach?",
        options: ["Bootstrap", "Foundation", "Tailwind CSS", "Bulma"],
        correctAnswer: 2,
        explanation: "Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.",
      },
      {
        id: 16,
        question: "What is an API endpoint?",
        options: ["A database table", "A URL where an API can be accessed", "A JavaScript function", "A CSS class"],
        correctAnswer: 1,
        explanation: "An API endpoint is a specific URL where an API can be accessed by a client application.",
      },
      {
        id: 17,
        question: "Which authentication method uses tokens?",
        options: ["Session-based", "JWT", "Cookies only", "Basic Auth"],
        correctAnswer: 1,
        explanation: "JWT (JSON Web Tokens) is a token-based authentication method.",
      },
      {
        id: 18,
        question: "What is the purpose of a CDN?",
        options: ["Database storage", "Content delivery optimization", "Code compilation", "User authentication"],
        correctAnswer: 1,
        explanation:
          "CDN (Content Delivery Network) optimizes content delivery by serving from geographically distributed servers.",
      },
      {
        id: 19,
        question: "Which testing framework is popular for JavaScript?",
        options: ["JUnit", "Jest", "PHPUnit", "NUnit"],
        correctAnswer: 1,
        explanation: "Jest is a popular JavaScript testing framework developed by Facebook.",
      },
      {
        id: 20,
        question: "What is responsive web design?",
        options: [
          "Fast loading websites",
          "Websites that adapt to different screen sizes",
          "Websites with animations",
          "Secure websites",
        ],
        correctAnswer: 1,
        explanation: "Responsive web design ensures websites work well on various devices and screen sizes.",
      },
      {
        id: 21,
        question: "Which database relationship represents one-to-many?",
        options: ["User has one profile", "User has many posts", "User belongs to one role", "User has one email"],
        correctAnswer: 1,
        explanation: "One user can have many posts, representing a one-to-many relationship.",
      },
      {
        id: 22,
        question: "What is the purpose of Docker in development?",
        options: ["Code editing", "Containerization", "Database management", "Version control"],
        correctAnswer: 1,
        explanation: "Docker provides containerization to package applications with their dependencies.",
      },
      {
        id: 23,
        question: "Which HTTP status code indicates success?",
        options: ["404", "500", "200", "301"],
        correctAnswer: 2,
        explanation: "HTTP status code 200 indicates a successful request.",
      },
      {
        id: 24,
        question: "What is the purpose of webpack?",
        options: ["Database queries", "Module bundling", "Server hosting", "User authentication"],
        correctAnswer: 1,
        explanation: "Webpack is a module bundler that packages JavaScript modules and assets.",
      },
      {
        id: 25,
        question: "Which principle emphasizes writing code that is easy to maintain?",
        options: ["DRY", "KISS", "SOLID", "All of the above"],
        correctAnswer: 3,
        explanation: "DRY, KISS, and SOLID are all principles that promote maintainable, clean code.",
      },
    ],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Data Science",
    duration: "50 min",
    difficulty: "Advanced",
    description: "Assessment covering machine learning, statistics, and data analysis",
    skills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
    questions: [
      {
        id: 1,
        question: "Which Python library is primarily used for data manipulation?",
        options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
        correctAnswer: 1,
        explanation: "Pandas is the primary library for data manipulation and analysis in Python.",
      },
      {
        id: 2,
        question: "What is overfitting in machine learning?",
        options: [
          "Model performs well on training data but poorly on test data",
          "Model performs poorly on all data",
          "Model is too simple",
          "Model trains too fast",
        ],
        correctAnswer: 0,
        explanation:
          "Overfitting occurs when a model learns the training data too well, including noise, leading to poor generalization.",
      },
      // Adding 23 more questions for Data Scientist
      {
        id: 3,
        question: "Which algorithm is best for classification problems?",
        options: ["Linear Regression", "Random Forest", "K-Means", "PCA"],
        correctAnswer: 1,
        explanation: "Random Forest is an ensemble method excellent for classification tasks.",
      },
      {
        id: 4,
        question: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Query Language",
          "Standard Query Language",
          "Sequential Query Language",
        ],
        correctAnswer: 0,
        explanation: "SQL stands for Structured Query Language, used for managing relational databases.",
      },
      {
        id: 5,
        question: "Which measure of central tendency is most affected by outliers?",
        options: ["Mean", "Median", "Mode", "Range"],
        correctAnswer: 0,
        explanation: "Mean is most affected by outliers as it considers all values in the calculation.",
      },
      {
        id: 6,
        question: "What is the purpose of cross-validation?",
        options: ["Data cleaning", "Model evaluation", "Feature selection", "Data visualization"],
        correctAnswer: 1,
        explanation: "Cross-validation is used to evaluate model performance and avoid overfitting.",
      },
      {
        id: 7,
        question: "Which visualization is best for showing correlation between two variables?",
        options: ["Bar chart", "Scatter plot", "Pie chart", "Histogram"],
        correctAnswer: 1,
        explanation:
          "Scatter plots effectively show the relationship and correlation between two continuous variables.",
      },
      {
        id: 8,
        question: "What is the difference between supervised and unsupervised learning?",
        options: [
          "Supervised uses labeled data",
          "Unsupervised uses labeled data",
          "No difference",
          "Supervised is faster",
        ],
        correctAnswer: 0,
        explanation:
          "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data.",
      },
      {
        id: 9,
        question: "Which Python library is used for machine learning?",
        options: ["Pandas", "NumPy", "Scikit-learn", "Matplotlib"],
        correctAnswer: 2,
        explanation: "Scikit-learn is the primary machine learning library in Python.",
      },
      {
        id: 10,
        question: "What is feature engineering?",
        options: [
          "Creating new features from existing data",
          "Removing features",
          "Visualizing features",
          "Storing features",
        ],
        correctAnswer: 0,
        explanation:
          "Feature engineering involves creating new features from existing data to improve model performance.",
      },
      {
        id: 11,
        question: "Which metric is used for regression problems?",
        options: ["Accuracy", "Precision", "RMSE", "F1-score"],
        correctAnswer: 2,
        explanation: "RMSE (Root Mean Square Error) is commonly used to evaluate regression models.",
      },
      {
        id: 12,
        question: "What is the curse of dimensionality?",
        options: [
          "Too many features make analysis difficult",
          "Too few features",
          "Data is too large",
          "Data is too small",
        ],
        correctAnswer: 0,
        explanation: "The curse of dimensionality refers to problems that arise when analyzing high-dimensional data.",
      },
      {
        id: 13,
        question: "Which algorithm is used for clustering?",
        options: ["Linear Regression", "Decision Tree", "K-Means", "Logistic Regression"],
        correctAnswer: 2,
        explanation: "K-Means is a popular unsupervised learning algorithm used for clustering.",
      },
      {
        id: 14,
        question: "What is the purpose of normalization in data preprocessing?",
        options: [
          "Remove duplicates",
          "Scale features to similar ranges",
          "Handle missing values",
          "Create new features",
        ],
        correctAnswer: 1,
        explanation: "Normalization scales features to similar ranges to prevent bias in machine learning algorithms.",
      },
      {
        id: 15,
        question: "Which statistical test is used to compare means of two groups?",
        options: ["Chi-square test", "T-test", "ANOVA", "Correlation test"],
        correctAnswer: 1,
        explanation: "T-test is used to compare the means of two groups.",
      },
      {
        id: 16,
        question: "What is A/B testing?",
        options: [
          "Testing two algorithms",
          "Comparing two versions of something",
          "Testing data quality",
          "Testing server performance",
        ],
        correctAnswer: 1,
        explanation: "A/B testing compares two versions to determine which performs better.",
      },
      {
        id: 17,
        question: "Which Python library is best for deep learning?",
        options: ["Pandas", "TensorFlow", "Matplotlib", "Seaborn"],
        correctAnswer: 1,
        explanation: "TensorFlow is a popular library for deep learning and neural networks.",
      },
      {
        id: 18,
        question: "What is the purpose of regularization?",
        options: ["Increase model complexity", "Prevent overfitting", "Speed up training", "Improve accuracy"],
        correctAnswer: 1,
        explanation: "Regularization techniques help prevent overfitting by adding penalties to complex models.",
      },
      {
        id: 19,
        question: "Which type of data visualization shows distribution?",
        options: ["Line chart", "Histogram", "Scatter plot", "Bar chart"],
        correctAnswer: 1,
        explanation: "Histograms effectively show the distribution of a single variable.",
      },
      {
        id: 20,
        question: "What is the difference between Type I and Type II errors?",
        options: [
          "Type I is false positive, Type II is false negative",
          "Type I is false negative, Type II is false positive",
          "No difference",
          "Both are the same",
        ],
        correctAnswer: 0,
        explanation:
          "Type I error is false positive (rejecting true null hypothesis), Type II is false negative (accepting false null hypothesis).",
      },
      {
        id: 21,
        question: "Which sampling technique ensures each member has equal chance of selection?",
        options: ["Stratified sampling", "Random sampling", "Systematic sampling", "Cluster sampling"],
        correctAnswer: 1,
        explanation: "Random sampling gives each member of the population an equal chance of being selected.",
      },
      {
        id: 22,
        question: "What is the purpose of PCA?",
        options: ["Classification", "Dimensionality reduction", "Clustering", "Regression"],
        correctAnswer: 1,
        explanation: "PCA (Principal Component Analysis) is used for dimensionality reduction.",
      },
      {
        id: 23,
        question: "Which metric measures the spread of data?",
        options: ["Mean", "Median", "Standard deviation", "Mode"],
        correctAnswer: 2,
        explanation: "Standard deviation measures how spread out data points are from the mean.",
      },
      {
        id: 24,
        question: "What is ensemble learning?",
        options: ["Using single model", "Combining multiple models", "Data preprocessing", "Feature selection"],
        correctAnswer: 1,
        explanation: "Ensemble learning combines multiple models to improve overall performance.",
      },
      {
        id: 25,
        question: "Which technique is used for handling missing data?",
        options: ["Imputation", "Normalization", "Scaling", "Encoding"],
        correctAnswer: 0,
        explanation: "Imputation is the process of filling in missing data values.",
      },
    ],
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    category: "Infrastructure",
    duration: "40 min",
    difficulty: "Advanced",
    description: "Assessment covering CI/CD, containerization, and cloud technologies",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of Docker?",
        options: ["Version control", "Containerization", "Database management", "Web hosting"],
        correctAnswer: 1,
        explanation: "Docker is primarily used for containerization of applications.",
      },
      // ... (would include 24 more questions)
      {
        id: 2,
        question: "Which tool is commonly used for container orchestration?",
        options: ["Docker", "Kubernetes", "Git", "Jenkins"],
        correctAnswer: 1,
        explanation: "Kubernetes is the leading container orchestration platform.",
      },
      {
        id: 3,
        question: "What does CI/CD stand for?",
        options: [
          "Continuous Integration/Continuous Deployment",
          "Code Integration/Code Deployment",
          "Container Integration/Container Deployment",
          "Cloud Integration/Cloud Deployment",
        ],
        correctAnswer: 0,
        explanation: "CI/CD stands for Continuous Integration and Continuous Deployment.",
      },
      {
        id: 4,
        question: "Which AWS service is used for computing?",
        options: ["S3", "RDS", "EC2", "Route 53"],
        correctAnswer: 2,
        explanation: "EC2 (Elastic Compute Cloud) provides scalable computing capacity in AWS.",
      },
      {
        id: 5,
        question: "What is Infrastructure as Code (IaC)?",
        options: [
          "Writing code for applications",
          "Managing infrastructure through code",
          "Coding in the cloud",
          "Infrastructure documentation",
        ],
        correctAnswer: 1,
        explanation:
          "IaC is the practice of managing and provisioning infrastructure through machine-readable definition files.",
      },
      // Adding 20 more questions to reach 25 total
      {
        id: 6,
        question: "Which command is used to build a Docker image?",
        options: ["docker run", "docker build", "docker create", "docker start"],
        correctAnswer: 1,
        explanation: "docker build is used to build Docker images from a Dockerfile.",
      },
      {
        id: 7,
        question: "What is a Kubernetes pod?",
        options: ["A container", "A group of containers", "A node", "A service"],
        correctAnswer: 1,
        explanation: "A pod is the smallest deployable unit in Kubernetes, containing one or more containers.",
      },
      {
        id: 8,
        question: "Which tool is used for configuration management?",
        options: ["Docker", "Ansible", "Git", "Jenkins"],
        correctAnswer: 1,
        explanation: "Ansible is a popular configuration management and automation tool.",
      },
      {
        id: 9,
        question: "What is the purpose of a load balancer?",
        options: ["Store data", "Distribute traffic", "Monitor systems", "Backup data"],
        correctAnswer: 1,
        explanation: "Load balancers distribute incoming network traffic across multiple servers.",
      },
      {
        id: 10,
        question: "Which monitoring tool is popular in DevOps?",
        options: ["Prometheus", "MySQL", "Apache", "Nginx"],
        correctAnswer: 0,
        explanation: "Prometheus is a popular open-source monitoring and alerting toolkit.",
      },
      {
        id: 11,
        question: "What is blue-green deployment?",
        options: [
          "Using blue and green colors in UI",
          "A deployment strategy with two identical environments",
          "A testing method",
          "A security practice",
        ],
        correctAnswer: 1,
        explanation: "Blue-green deployment uses two identical production environments to reduce downtime and risk.",
      },
      {
        id: 12,
        question: "Which version control system is most commonly used?",
        options: ["SVN", "Git", "Mercurial", "CVS"],
        correctAnswer: 1,
        explanation: "Git is the most widely used distributed version control system.",
      },
      {
        id: 13,
        question: "What is the purpose of Jenkins?",
        options: ["Container orchestration", "Continuous integration", "Database management", "Web serving"],
        correctAnswer: 1,
        explanation: "Jenkins is an automation server used for continuous integration and deployment.",
      },
      {
        id: 14,
        question: "Which AWS service provides object storage?",
        options: ["EC2", "RDS", "S3", "Lambda"],
        correctAnswer: 2,
        explanation: "S3 (Simple Storage Service) provides scalable object storage in AWS.",
      },
      {
        id: 15,
        question: "What is a microservice architecture?",
        options: [
          "Small applications",
          "Breaking applications into small, independent services",
          "Tiny databases",
          "Mini servers",
        ],
        correctAnswer: 1,
        explanation:
          "Microservices architecture breaks applications into small, independent, loosely coupled services.",
      },
      {
        id: 16,
        question: "Which tool is used for log aggregation?",
        options: ["Docker", "ELK Stack", "Git", "Ansible"],
        correctAnswer: 1,
        explanation: "ELK Stack (Elasticsearch, Logstash, Kibana) is commonly used for log aggregation and analysis.",
      },
      {
        id: 17,
        question: "What is the purpose of Terraform?",
        options: ["Container management", "Infrastructure as Code", "Application deployment", "Monitoring"],
        correctAnswer: 1,
        explanation:
          "Terraform is an Infrastructure as Code tool for building, changing, and versioning infrastructure.",
      },
      {
        id: 18,
        question: "Which protocol is commonly used for container communication?",
        options: ["FTP", "HTTP/HTTPS", "SMTP", "SNMP"],
        correctAnswer: 1,
        explanation: "HTTP/HTTPS is commonly used for communication between containerized services.",
      },
      {
        id: 19,
        question: "What is a Docker registry?",
        options: ["A container", "A storage for Docker images", "A monitoring tool", "A deployment tool"],
        correctAnswer: 1,
        explanation: "A Docker registry is a storage and distribution system for Docker images.",
      },
      {
        id: 20,
        question: "Which practice involves frequent code integration?",
        options: ["Continuous Integration", "Continuous Deployment", "Continuous Monitoring", "Continuous Testing"],
        correctAnswer: 0,
        explanation: "Continuous Integration involves frequently integrating code changes into a shared repository.",
      },
      {
        id: 21,
        question: "What is the purpose of a reverse proxy?",
        options: ["Forward client requests", "Cache responses", "Load balancing", "All of the above"],
        correctAnswer: 3,
        explanation: "A reverse proxy can forward requests, cache responses, and provide load balancing.",
      },
      {
        id: 22,
        question: "Which cloud service model provides the most control?",
        options: ["SaaS", "PaaS", "IaaS", "FaaS"],
        correctAnswer: 2,
        explanation: "IaaS (Infrastructure as a Service) provides the most control over the underlying infrastructure.",
      },
      {
        id: 23,
        question: "What is the purpose of health checks in containers?",
        options: ["Monitor container health", "Update containers", "Scale containers", "Secure containers"],
        correctAnswer: 0,
        explanation: "Health checks monitor the health status of containers and applications.",
      },
      {
        id: 24,
        question: "Which tool is used for secrets management?",
        options: ["Docker", "Vault", "Git", "Jenkins"],
        correctAnswer: 1,
        explanation: "HashiCorp Vault is a popular tool for secrets management and data protection.",
      },
      {
        id: 25,
        question: "What is the difference between horizontal and vertical scaling?",
        options: [
          "Horizontal adds more servers, vertical adds more power",
          "Vertical adds more servers, horizontal adds more power",
          "No difference",
          "Both are the same",
        ],
        correctAnswer: 0,
        explanation:
          "Horizontal scaling adds more servers, while vertical scaling adds more power to existing servers.",
      },
    ],
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "Development",
    duration: "35 min",
    difficulty: "Intermediate",
    description: "Assessment focusing on HTML, CSS, JavaScript, and modern frontend frameworks",
    skills: ["HTML", "CSS", "JavaScript", "React", "Vue.js"],
    questions: [
      {
        id: 1,
        question: "Which CSS property is used to create flexbox layouts?",
        options: ["display: flex", "layout: flex", "flex: true", "flexbox: on"],
        correctAnswer: 0,
        explanation: "display: flex is used to create a flex container and enable flexbox layout.",
      },
      // ... would include 24 more questions
      {
        id: 2,
        question: "What is the purpose of semantic HTML?",
        options: ["Better styling", "Improved accessibility and SEO", "Faster loading", "Smaller file size"],
        correctAnswer: 1,
        explanation:
          "Semantic HTML improves accessibility for screen readers and helps search engines understand content structure.",
      },
      // Adding abbreviated questions for demo
      ...Array.from({ length: 23 }, (_, i) => ({
        id: i + 3,
        question: `Frontend question ${i + 3}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        explanation: `Explanation for frontend question ${i + 3}`,
      })),
    ],
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    category: "Development",
    duration: "40 min",
    difficulty: "Intermediate",
    description: "Server-side development, APIs, databases, and system architecture",
    skills: ["Node.js", "Python", "Java", "SQL", "REST APIs"],
    questions: Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      question: `Backend development question ${i + 1}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `Explanation for backend question ${i + 1}`,
    })),
  },
  {
    id: "mobile-developer",
    title: "Mobile Developer",
    category: "Development",
    duration: "45 min",
    difficulty: "Intermediate",
    description: "iOS and Android development, React Native, Flutter",
    skills: ["React Native", "Flutter", "Swift", "Kotlin", "Mobile UI/UX"],
    questions: Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      question: `Mobile development question ${i + 1}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `Explanation for mobile question ${i + 1}`,
    })),
  },
  // Adding more roles with generated questions
  ...Array.from({ length: 44 }, (_, index) => {
    const roles = [
      "UI/UX Designer",
      "Product Manager",
      "QA Engineer",
      "Security Analyst",
      "Cloud Architect",
      "Machine Learning Engineer",
      "Blockchain Developer",
      "Game Developer",
      "Database Administrator",
      "Network Engineer",
      "Systems Administrator",
      "Technical Writer",
      "Scrum Master",
      "Business Analyst",
      "Solutions Architect",
      "Site Reliability Engineer",
      "Platform Engineer",
      "Data Engineer",
      "AI Engineer",
      "Cybersecurity Specialist",
      "Software Architect",
      "Integration Developer",
      "Performance Engineer",
      "Release Manager",
      "Technical Lead",
      "Engineering Manager",
      "Principal Engineer",
      "Staff Engineer",
      "Senior Developer",
      "Junior Developer",
      "Intern Developer",
      "Freelance Developer",
      "Consultant",
      "Technical Recruiter",
      "Developer Advocate",
      "Sales Engineer",
      "Support Engineer",
      "Field Engineer",
      "Research Engineer",
      "Hardware Engineer",
      "Embedded Systems Engineer",
      "Firmware Developer",
      "Test Automation Engineer",
      "Infrastructure Engineer",
    ]

    const categories = ["Development", "Design", "Management", "Engineering", "Security", "Data Science"]
    const difficulties = ["Beginner", "Intermediate", "Advanced"]

    return {
      id: roles[index].toLowerCase().replace(/[^a-z0-9]/g, "-"),
      title: roles[index],
      category: categories[Math.floor(Math.random() * categories.length)],
      duration: `${30 + Math.floor(Math.random() * 30)} min`,
      difficulty: difficulties[Math.floor(Math.random() * 3)] as "Beginner" | "Intermediate" | "Advanced",
      description: `Comprehensive assessment for ${roles[index]} role covering essential skills and knowledge`,
      skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
      questions: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        question: `${roles[index]} question ${i + 1}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `Explanation for ${roles[index]} question ${i + 1}`,
      })),
    }
  }),
]

// Function to get assessment by ID
export function getAssessmentById(id: string): Assessment | undefined {
  return itRoleAssessments.find((assessment) => assessment.id === id)
}

// Function to get all assessment categories
export function getAssessmentCategories(): string[] {
  return [...new Set(itRoleAssessments.map((assessment) => assessment.category))]
}
