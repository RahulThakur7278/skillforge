/**
 * Database Seed Script
 *
 * Populates CognoDB with realistic tech-industry skill graph data.
 * Run: node scripts/seed.js
 *
 * Creates ~80 skills, ~30 roles, ~10 domains, ~50 resources,
 * ~40 professionals, and ~400+ relationships.
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const neo4j = require('neo4j-driver');

const URI = process.env.COGNODB_URI;
const USER = process.env.COGNODB_USERNAME || 'cognodb';
const PASS = process.env.COGNODB_PASSWORD;

if (!URI || !PASS) {
  console.error('❌ Missing COGNODB_URI or COGNODB_PASSWORD in .env');
  process.exit(1);
}

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASS));

/* ===========================
   SEED DATA
   =========================== */

const domains = [
  { name: 'Frontend', description: 'Client-side web development and UI engineering', color: '#7c3aed' },
  { name: 'Backend', description: 'Server-side development and API design', color: '#2563eb' },
  { name: 'Data Science', description: 'Data analysis, machine learning, and AI', color: '#14b8a6' },
  { name: 'DevOps', description: 'Infrastructure, CI/CD, and cloud operations', color: '#f59e0b' },
  { name: 'Mobile', description: 'iOS and Android application development', color: '#ef4444' },
  { name: 'Security', description: 'Application and infrastructure security', color: '#ec4899' },
  { name: 'Design', description: 'UX/UI design and product design', color: '#8b5cf6' },
  { name: 'Database', description: 'Data storage, modeling, and administration', color: '#06b6d4' },
  { name: 'Cloud', description: 'Cloud platforms and distributed systems', color: '#f97316' },
  { name: 'Foundations', description: 'Core programming and CS fundamentals', color: '#6b7280' },
];

const skills = [
  // Foundations
  { name: 'Programming Fundamentals', category: 'Core', difficulty: 1, description: 'Variables, loops, conditionals, functions', icon: '💻', domains: ['Foundations'] },
  { name: 'Data Structures', category: 'Core', difficulty: 2, description: 'Arrays, linked lists, trees, hash maps', icon: '🏗️', domains: ['Foundations'] },
  { name: 'Algorithms', category: 'Core', difficulty: 3, description: 'Sorting, searching, graph algorithms, dynamic programming', icon: '⚙️', domains: ['Foundations'] },
  { name: 'Git', category: 'Tools', difficulty: 1, description: 'Version control with Git and GitHub', icon: '🔀', domains: ['Foundations'] },
  { name: 'Linux CLI', category: 'Tools', difficulty: 2, description: 'Command-line proficiency and shell scripting', icon: '🐧', domains: ['Foundations', 'DevOps'] },
  { name: 'HTTP & APIs', category: 'Core', difficulty: 2, description: 'REST, HTTP methods, status codes, API design', icon: '🌐', domains: ['Foundations', 'Backend'] },
  { name: 'OOP', category: 'Core', difficulty: 2, description: 'Object-oriented programming principles', icon: '🧱', domains: ['Foundations'] },

  // Frontend
  { name: 'HTML & CSS', category: 'Frontend', difficulty: 1, description: 'Semantic HTML, CSS layout, responsive design', icon: '🎨', domains: ['Frontend'] },
  { name: 'JavaScript', category: 'Frontend', difficulty: 2, description: 'ES6+, async/await, DOM manipulation', icon: '📜', domains: ['Frontend', 'Foundations'] },
  { name: 'TypeScript', category: 'Frontend', difficulty: 3, description: 'Static typing for JavaScript', icon: '🔷', domains: ['Frontend', 'Backend'] },
  { name: 'React', category: 'Frontend', difficulty: 3, description: 'Component-based UI library', icon: '⚛️', domains: ['Frontend'] },
  { name: 'Vue.js', category: 'Frontend', difficulty: 3, description: 'Progressive JavaScript framework', icon: '💚', domains: ['Frontend'] },
  { name: 'Angular', category: 'Frontend', difficulty: 4, description: 'Enterprise-grade frontend framework', icon: '🅰️', domains: ['Frontend'] },
  { name: 'Next.js', category: 'Frontend', difficulty: 4, description: 'React meta-framework with SSR/SSG', icon: '▲', domains: ['Frontend', 'Backend'] },
  { name: 'CSS Architecture', category: 'Frontend', difficulty: 3, description: 'Design systems, CSS-in-JS, Tailwind', icon: '🎭', domains: ['Frontend', 'Design'] },
  { name: 'Web Performance', category: 'Frontend', difficulty: 4, description: 'Core Web Vitals, lazy loading, optimization', icon: '⚡', domains: ['Frontend'] },
  { name: 'Accessibility', category: 'Frontend', difficulty: 3, description: 'WCAG guidelines, ARIA, screen readers', icon: '♿', domains: ['Frontend', 'Design'] },
  { name: 'Testing (Frontend)', category: 'Frontend', difficulty: 3, description: 'Jest, React Testing Library, Cypress', icon: '🧪', domains: ['Frontend'] },

  // Backend
  { name: 'Node.js', category: 'Backend', difficulty: 3, description: 'Server-side JavaScript runtime', icon: '🟢', domains: ['Backend'] },
  { name: 'Python', category: 'Backend', difficulty: 2, description: 'General-purpose programming language', icon: '🐍', domains: ['Backend', 'Data Science'] },
  { name: 'Java', category: 'Backend', difficulty: 3, description: 'Enterprise-grade object-oriented language', icon: '☕', domains: ['Backend'] },
  { name: 'Go', category: 'Backend', difficulty: 3, description: 'Systems programming language by Google', icon: '🐹', domains: ['Backend', 'Cloud'] },
  { name: 'Express.js', category: 'Backend', difficulty: 2, description: 'Minimal Node.js web framework', icon: '🚂', domains: ['Backend'] },
  { name: 'Django', category: 'Backend', difficulty: 3, description: 'Full-featured Python web framework', icon: '🎸', domains: ['Backend'] },
  { name: 'Spring Boot', category: 'Backend', difficulty: 4, description: 'Java application framework', icon: '🍃', domains: ['Backend'] },
  { name: 'GraphQL', category: 'Backend', difficulty: 3, description: 'Query language for APIs', icon: '◈', domains: ['Backend', 'Frontend'] },
  { name: 'Microservices', category: 'Architecture', difficulty: 4, description: 'Distributed system architecture patterns', icon: '🏛️', domains: ['Backend', 'Cloud'] },
  { name: 'Message Queues', category: 'Backend', difficulty: 3, description: 'RabbitMQ, Kafka, event-driven architecture', icon: '📨', domains: ['Backend', 'Cloud'] },
  { name: 'Authentication', category: 'Backend', difficulty: 3, description: 'OAuth, JWT, session management', icon: '🔐', domains: ['Backend', 'Security'] },
  { name: 'Testing (Backend)', category: 'Backend', difficulty: 3, description: 'Unit testing, integration testing, TDD', icon: '✅', domains: ['Backend'] },

  // Data Science
  { name: 'Statistics', category: 'Data Science', difficulty: 3, description: 'Probability, distributions, hypothesis testing', icon: '📊', domains: ['Data Science'] },
  { name: 'Pandas', category: 'Data Science', difficulty: 2, description: 'Python data manipulation library', icon: '🐼', domains: ['Data Science'] },
  { name: 'Machine Learning', category: 'Data Science', difficulty: 4, description: 'Supervised and unsupervised learning algorithms', icon: '🤖', domains: ['Data Science'] },
  { name: 'Deep Learning', category: 'Data Science', difficulty: 5, description: 'Neural networks, CNNs, RNNs, Transformers', icon: '🧠', domains: ['Data Science'] },
  { name: 'NLP', category: 'Data Science', difficulty: 5, description: 'Natural language processing and text analysis', icon: '💬', domains: ['Data Science'] },
  { name: 'Computer Vision', category: 'Data Science', difficulty: 5, description: 'Image classification, object detection', icon: '👁️', domains: ['Data Science'] },
  { name: 'Data Visualization', category: 'Data Science', difficulty: 2, description: 'Matplotlib, D3.js, Tableau', icon: '📈', domains: ['Data Science', 'Frontend'] },
  { name: 'MLOps', category: 'Data Science', difficulty: 4, description: 'ML model deployment and monitoring', icon: '🔄', domains: ['Data Science', 'DevOps'] },
  { name: 'LLMs & Prompt Engineering', category: 'Data Science', difficulty: 3, description: 'Large language models, fine-tuning, RAG', icon: '✨', domains: ['Data Science'] },

  // DevOps
  { name: 'Docker', category: 'DevOps', difficulty: 3, description: 'Containerization and Docker Compose', icon: '🐳', domains: ['DevOps'] },
  { name: 'Kubernetes', category: 'DevOps', difficulty: 5, description: 'Container orchestration at scale', icon: '☸️', domains: ['DevOps', 'Cloud'] },
  { name: 'CI/CD', category: 'DevOps', difficulty: 3, description: 'GitHub Actions, Jenkins, automated pipelines', icon: '🔁', domains: ['DevOps'] },
  { name: 'Terraform', category: 'DevOps', difficulty: 4, description: 'Infrastructure as Code', icon: '🏗️', domains: ['DevOps', 'Cloud'] },
  { name: 'Monitoring', category: 'DevOps', difficulty: 3, description: 'Prometheus, Grafana, alerting', icon: '📡', domains: ['DevOps'] },
  { name: 'AWS', category: 'Cloud', difficulty: 4, description: 'Amazon Web Services core services', icon: '☁️', domains: ['Cloud', 'DevOps'] },
  { name: 'GCP', category: 'Cloud', difficulty: 4, description: 'Google Cloud Platform', icon: '🌤️', domains: ['Cloud'] },
  { name: 'Azure', category: 'Cloud', difficulty: 4, description: 'Microsoft Azure services', icon: '🔵', domains: ['Cloud'] },
  { name: 'Networking', category: 'DevOps', difficulty: 3, description: 'TCP/IP, DNS, load balancing, CDN', icon: '🌐', domains: ['DevOps', 'Security'] },

  // Database
  { name: 'SQL', category: 'Database', difficulty: 2, description: 'Relational database querying', icon: '🗄️', domains: ['Database', 'Backend'] },
  { name: 'PostgreSQL', category: 'Database', difficulty: 3, description: 'Advanced relational database', icon: '🐘', domains: ['Database'] },
  { name: 'MongoDB', category: 'Database', difficulty: 2, description: 'Document-oriented NoSQL database', icon: '🍃', domains: ['Database'] },
  { name: 'Redis', category: 'Database', difficulty: 2, description: 'In-memory data store and cache', icon: '🔴', domains: ['Database', 'Backend'] },
  { name: 'Graph Databases', category: 'Database', difficulty: 3, description: 'Neo4j, CognoDB, Cypher queries', icon: '🕸️', domains: ['Database'] },
  { name: 'Database Design', category: 'Database', difficulty: 3, description: 'Normalization, indexing, data modeling', icon: '📐', domains: ['Database'] },

  // Mobile
  { name: 'React Native', category: 'Mobile', difficulty: 3, description: 'Cross-platform mobile development', icon: '📱', domains: ['Mobile', 'Frontend'] },
  { name: 'Swift', category: 'Mobile', difficulty: 3, description: 'iOS native development', icon: '🍎', domains: ['Mobile'] },
  { name: 'Kotlin', category: 'Mobile', difficulty: 3, description: 'Android native development', icon: '🤖', domains: ['Mobile'] },
  { name: 'Flutter', category: 'Mobile', difficulty: 3, description: 'Google cross-platform UI toolkit', icon: '🦋', domains: ['Mobile'] },

  // Security
  { name: 'OWASP Top 10', category: 'Security', difficulty: 3, description: 'Common web vulnerabilities', icon: '🛡️', domains: ['Security'] },
  { name: 'Cryptography', category: 'Security', difficulty: 4, description: 'Encryption, hashing, PKI', icon: '🔑', domains: ['Security'] },
  { name: 'Penetration Testing', category: 'Security', difficulty: 4, description: 'Ethical hacking and vulnerability assessment', icon: '🎯', domains: ['Security'] },

  // Design
  { name: 'UI Design', category: 'Design', difficulty: 2, description: 'Visual design, color theory, typography', icon: '🎨', domains: ['Design'] },
  { name: 'UX Research', category: 'Design', difficulty: 3, description: 'User interviews, usability testing, personas', icon: '🔍', domains: ['Design'] },
  { name: 'Figma', category: 'Design', difficulty: 2, description: 'Collaborative design and prototyping tool', icon: '🖌️', domains: ['Design'] },
  { name: 'Design Systems', category: 'Design', difficulty: 4, description: 'Component libraries, tokens, documentation', icon: '📚', domains: ['Design', 'Frontend'] },

  // Architecture
  { name: 'System Design', category: 'Architecture', difficulty: 5, description: 'Designing scalable distributed systems', icon: '🏛️', domains: ['Backend', 'Cloud'] },
  { name: 'API Design', category: 'Architecture', difficulty: 3, description: 'RESTful design, versioning, documentation', icon: '📋', domains: ['Backend'] },
  { name: 'Event-Driven Architecture', category: 'Architecture', difficulty: 4, description: 'CQRS, event sourcing, pub/sub', icon: '⚡', domains: ['Backend', 'Cloud'] },
];

const roles = [
  // Junior
  { title: 'Junior Frontend Developer', level: 'junior', domain: 'Frontend', avg_salary: 55000, description: 'Entry-level frontend development' },
  { title: 'Junior Backend Developer', level: 'junior', domain: 'Backend', avg_salary: 58000, description: 'Entry-level server-side development' },
  { title: 'Junior Data Analyst', level: 'junior', domain: 'Data Science', avg_salary: 52000, description: 'Entry-level data analysis' },
  { title: 'Junior DevOps Engineer', level: 'junior', domain: 'DevOps', avg_salary: 60000, description: 'Entry-level infrastructure and CI/CD' },
  { title: 'Junior Mobile Developer', level: 'junior', domain: 'Mobile', avg_salary: 55000, description: 'Entry-level mobile app development' },
  { title: 'UI Designer', level: 'junior', domain: 'Design', avg_salary: 50000, description: 'Entry-level visual and UI design' },

  // Mid
  { title: 'Frontend Developer', level: 'mid', domain: 'Frontend', avg_salary: 85000, description: 'Mid-level frontend engineering' },
  { title: 'Backend Developer', level: 'mid', domain: 'Backend', avg_salary: 90000, description: 'Mid-level server-side engineering' },
  { title: 'Full-Stack Developer', level: 'mid', domain: 'Frontend', avg_salary: 92000, description: 'Full-stack web development' },
  { title: 'Data Scientist', level: 'mid', domain: 'Data Science', avg_salary: 95000, description: 'ML model development and analysis' },
  { title: 'DevOps Engineer', level: 'mid', domain: 'DevOps', avg_salary: 95000, description: 'Infrastructure automation and reliability' },
  { title: 'Mobile Developer', level: 'mid', domain: 'Mobile', avg_salary: 88000, description: 'Cross-platform mobile development' },
  { title: 'Security Engineer', level: 'mid', domain: 'Security', avg_salary: 100000, description: 'Application and infrastructure security' },
  { title: 'UX Designer', level: 'mid', domain: 'Design', avg_salary: 82000, description: 'User experience research and design' },
  { title: 'Database Administrator', level: 'mid', domain: 'Database', avg_salary: 88000, description: 'Database management and optimization' },

  // Senior
  { title: 'Senior Frontend Engineer', level: 'senior', domain: 'Frontend', avg_salary: 130000, description: 'Senior-level frontend architecture' },
  { title: 'Senior Backend Engineer', level: 'senior', domain: 'Backend', avg_salary: 140000, description: 'Senior-level backend architecture' },
  { title: 'Senior Full-Stack Engineer', level: 'senior', domain: 'Frontend', avg_salary: 135000, description: 'Senior full-stack development' },
  { title: 'Senior Data Scientist', level: 'senior', domain: 'Data Science', avg_salary: 150000, description: 'Advanced ML and research' },
  { title: 'Senior DevOps Engineer', level: 'senior', domain: 'DevOps', avg_salary: 145000, description: 'Senior infrastructure engineering' },
  { title: 'ML Engineer', level: 'senior', domain: 'Data Science', avg_salary: 155000, description: 'ML system design and deployment' },
  { title: 'Cloud Architect', level: 'senior', domain: 'Cloud', avg_salary: 160000, description: 'Cloud infrastructure architecture' },

  // Lead
  { title: 'Engineering Manager', level: 'lead', domain: 'Backend', avg_salary: 175000, description: 'Technical team leadership' },
  { title: 'Staff Engineer', level: 'lead', domain: 'Backend', avg_salary: 190000, description: 'Cross-team technical leadership' },
  { title: 'Principal Engineer', level: 'lead', domain: 'Backend', avg_salary: 220000, description: 'Organization-wide technical strategy' },
  { title: 'VP of Engineering', level: 'lead', domain: 'Backend', avg_salary: 250000, description: 'Engineering organization leadership' },
  { title: 'Head of Data', level: 'lead', domain: 'Data Science', avg_salary: 200000, description: 'Data organization leadership' },
  { title: 'Head of Design', level: 'lead', domain: 'Design', avg_salary: 180000, description: 'Design organization leadership' },
  { title: 'CTO', level: 'lead', domain: 'Cloud', avg_salary: 280000, description: 'Chief Technology Officer' },
];

const resources = [
  { title: 'freeCodeCamp Web Development', type: 'course', provider: 'freeCodeCamp', url: 'https://freecodecamp.org', duration_hours: 300, rating: 4.8, teaches: ['HTML & CSS', 'JavaScript', 'React'] },
  { title: 'CS50 Introduction to CS', type: 'course', provider: 'Harvard / edX', url: 'https://cs50.harvard.edu', duration_hours: 100, rating: 4.9, teaches: ['Programming Fundamentals', 'Data Structures', 'Algorithms'] },
  { title: 'The Odin Project', type: 'course', provider: 'The Odin Project', url: 'https://theodinproject.com', duration_hours: 500, rating: 4.7, teaches: ['HTML & CSS', 'JavaScript', 'Node.js', 'React', 'Git'] },
  { title: 'Fullstack Open', type: 'course', provider: 'University of Helsinki', url: 'https://fullstackopen.com', duration_hours: 200, rating: 4.8, teaches: ['React', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'GraphQL'] },
  { title: 'Python for Everybody', type: 'course', provider: 'Coursera', url: 'https://py4e.com', duration_hours: 80, rating: 4.8, teaches: ['Python', 'Programming Fundamentals'] },
  { title: 'Fast.ai Practical Deep Learning', type: 'course', provider: 'fast.ai', url: 'https://fast.ai', duration_hours: 70, rating: 4.9, teaches: ['Deep Learning', 'Machine Learning', 'Python'] },
  { title: 'Andrew Ng ML Specialization', type: 'course', provider: 'Coursera', url: 'https://coursera.org', duration_hours: 100, rating: 4.9, teaches: ['Machine Learning', 'Statistics', 'Python'] },
  { title: 'Docker Deep Dive', type: 'book', provider: 'Nigel Poulton', url: 'https://dockerdeepdriver.com', duration_hours: 15, rating: 4.7, teaches: ['Docker', 'Linux CLI'] },
  { title: 'Kubernetes the Hard Way', type: 'tutorial', provider: 'Kelsey Hightower', url: 'https://github.com/kelseyhightower/kubernetes-the-hard-way', duration_hours: 20, rating: 4.8, teaches: ['Kubernetes', 'Docker', 'Networking'] },
  { title: 'AWS Certified Solutions Architect', type: 'course', provider: 'AWS', url: 'https://aws.amazon.com/certification', duration_hours: 60, rating: 4.6, teaches: ['AWS', 'Networking', 'System Design'] },
  { title: 'Designing Data-Intensive Applications', type: 'book', provider: 'Martin Kleppmann', url: 'https://dataintensive.net', duration_hours: 30, rating: 4.9, teaches: ['System Design', 'Database Design', 'Message Queues', 'Microservices'] },
  { title: 'Clean Code', type: 'book', provider: 'Robert C. Martin', url: 'https://cleancoders.com', duration_hours: 15, rating: 4.5, teaches: ['OOP', 'Testing (Backend)'] },
  { title: 'JavaScript.info', type: 'tutorial', provider: 'javascript.info', url: 'https://javascript.info', duration_hours: 50, rating: 4.8, teaches: ['JavaScript', 'HTML & CSS'] },
  { title: 'Go by Example', type: 'tutorial', provider: 'gobyexample.com', url: 'https://gobyexample.com', duration_hours: 15, rating: 4.7, teaches: ['Go'] },
  { title: 'Terraform Up & Running', type: 'book', provider: 'Yevgeniy Brikman', url: 'https://terraformupandrunning.com', duration_hours: 20, rating: 4.6, teaches: ['Terraform', 'AWS'] },
  { title: 'OWASP Testing Guide', type: 'tutorial', provider: 'OWASP', url: 'https://owasp.org', duration_hours: 25, rating: 4.5, teaches: ['OWASP Top 10', 'Penetration Testing', 'Authentication'] },
  { title: 'React Official Tutorial', type: 'tutorial', provider: 'React', url: 'https://react.dev', duration_hours: 10, rating: 4.7, teaches: ['React', 'JavaScript'] },
  { title: 'Next.js Learn', type: 'tutorial', provider: 'Vercel', url: 'https://nextjs.org/learn', duration_hours: 15, rating: 4.7, teaches: ['Next.js', 'React', 'TypeScript'] },
  { title: 'SQL for Data Scientists', type: 'course', provider: 'Coursera', url: 'https://coursera.org', duration_hours: 30, rating: 4.5, teaches: ['SQL', 'Database Design'] },
  { title: 'Figma for Beginners', type: 'course', provider: 'Figma', url: 'https://figma.com', duration_hours: 10, rating: 4.6, teaches: ['Figma', 'UI Design'] },
  { title: 'NLP with Transformers', type: 'book', provider: "O'Reilly", url: 'https://oreilly.com', duration_hours: 25, rating: 4.7, teaches: ['NLP', 'Deep Learning', 'LLMs & Prompt Engineering'] },
  { title: 'System Design Interview', type: 'book', provider: 'Alex Xu', url: 'https://bytebytego.com', duration_hours: 20, rating: 4.8, teaches: ['System Design', 'Microservices', 'Database Design'] },
  { title: 'Flutter Official Docs', type: 'tutorial', provider: 'Google', url: 'https://flutter.dev', duration_hours: 30, rating: 4.6, teaches: ['Flutter', 'Kotlin'] },
  { title: 'Spring Boot in Action', type: 'book', provider: 'Manning', url: 'https://manning.com', duration_hours: 20, rating: 4.5, teaches: ['Spring Boot', 'Java'] },
  { title: 'Vue Mastery', type: 'course', provider: 'Vue Mastery', url: 'https://vuemastery.com', duration_hours: 40, rating: 4.7, teaches: ['Vue.js', 'JavaScript', 'TypeScript'] },
];

const professionals = [
  { name: 'Alice Chen', current_role: 'Senior Frontend Engineer', experience_years: 7, location: 'San Francisco', skills: ['React', 'TypeScript', 'Next.js', 'CSS Architecture', 'JavaScript', 'HTML & CSS', 'Git', 'Testing (Frontend)', 'Web Performance', 'Accessibility'] },
  { name: 'Bob Martinez', current_role: 'Backend Developer', experience_years: 4, location: 'Austin', skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Git', 'SQL', 'Linux CLI', 'Testing (Backend)', 'HTTP & APIs'] },
  { name: 'Carol Williams', current_role: 'Data Scientist', experience_years: 5, location: 'New York', skills: ['Python', 'Machine Learning', 'Statistics', 'Pandas', 'Deep Learning', 'SQL', 'Data Visualization', 'Git'] },
  { name: 'David Kim', current_role: 'DevOps Engineer', experience_years: 6, location: 'Seattle', skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux CLI', 'Monitoring', 'Networking', 'Git', 'Python'] },
  { name: 'Eva Patel', current_role: 'Full-Stack Developer', experience_years: 4, location: 'London', skills: ['React', 'Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Git', 'JavaScript', 'HTML & CSS', 'Docker', 'PostgreSQL'] },
  { name: 'Frank Liu', current_role: 'ML Engineer', experience_years: 8, location: 'San Francisco', skills: ['Python', 'Machine Learning', 'Deep Learning', 'Docker', 'Kubernetes', 'AWS', 'MLOps', 'Statistics', 'NLP', 'Git'] },
  { name: 'Grace Torres', current_role: 'UX Designer', experience_years: 5, location: 'Portland', skills: ['Figma', 'UI Design', 'UX Research', 'HTML & CSS', 'Design Systems', 'Accessibility'] },
  { name: 'Henry Zhao', current_role: 'Cloud Architect', experience_years: 10, location: 'Seattle', skills: ['AWS', 'GCP', 'Terraform', 'Kubernetes', 'Docker', 'System Design', 'Networking', 'Microservices', 'Monitoring', 'Linux CLI', 'CI/CD'] },
  { name: 'Iris Johnson', current_role: 'Security Engineer', experience_years: 6, location: 'Washington DC', skills: ['OWASP Top 10', 'Cryptography', 'Penetration Testing', 'Linux CLI', 'Networking', 'Python', 'Authentication', 'Docker'] },
  { name: 'Jack Robinson', current_role: 'Junior Frontend Developer', experience_years: 1, location: 'Chicago', skills: ['HTML & CSS', 'JavaScript', 'React', 'Git', 'Programming Fundamentals'] },
  { name: 'Kate Anderson', current_role: 'Senior Backend Engineer', experience_years: 9, location: 'Boston', skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Docker', 'Kubernetes', 'System Design', 'Message Queues', 'CI/CD', 'Git', 'SQL', 'API Design', 'Testing (Backend)'] },
  { name: 'Liam O\'Brien', current_role: 'Mobile Developer', experience_years: 4, location: 'Dublin', skills: ['React Native', 'JavaScript', 'TypeScript', 'Swift', 'Git', 'HTML & CSS', 'React'] },
  { name: 'Mia Garcia', current_role: 'Junior Data Analyst', experience_years: 1, location: 'Miami', skills: ['SQL', 'Python', 'Pandas', 'Data Visualization', 'Statistics', 'Git'] },
  { name: 'Noah Brown', current_role: 'Senior DevOps Engineer', experience_years: 8, location: 'Denver', skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'GCP', 'CI/CD', 'Monitoring', 'Linux CLI', 'Networking', 'System Design', 'Git', 'Go'] },
  { name: 'Olivia Davis', current_role: 'Frontend Developer', experience_years: 3, location: 'Toronto', skills: ['React', 'TypeScript', 'JavaScript', 'HTML & CSS', 'CSS Architecture', 'Git', 'Testing (Frontend)', 'Next.js'] },
  { name: 'Peter Wilson', current_role: 'Backend Developer', experience_years: 3, location: 'Berlin', skills: ['Go', 'PostgreSQL', 'Docker', 'Redis', 'Git', 'Linux CLI', 'HTTP & APIs', 'SQL', 'Microservices'] },
  { name: 'Quinn Taylor', current_role: 'Data Scientist', experience_years: 4, location: 'Toronto', skills: ['Python', 'Machine Learning', 'Pandas', 'Statistics', 'Deep Learning', 'NLP', 'Data Visualization', 'SQL', 'LLMs & Prompt Engineering'] },
  { name: 'Rachel Lee', current_role: 'Engineering Manager', experience_years: 12, location: 'San Francisco', skills: ['System Design', 'Microservices', 'Python', 'Java', 'AWS', 'Docker', 'CI/CD', 'API Design', 'Git', 'PostgreSQL', 'Event-Driven Architecture'] },
  { name: 'Sam Cooper', current_role: 'Junior Backend Developer', experience_years: 1, location: 'Nashville', skills: ['Python', 'Git', 'SQL', 'HTTP & APIs', 'Programming Fundamentals', 'Linux CLI'] },
  { name: 'Tara Singh', current_role: 'Senior Full-Stack Engineer', experience_years: 7, location: 'Bangalore', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'MongoDB', 'Redis', 'Git', 'CI/CD', 'Next.js', 'System Design'] },
  { name: 'Uma Nakamura', current_role: 'Database Administrator', experience_years: 6, location: 'Tokyo', skills: ['PostgreSQL', 'SQL', 'MongoDB', 'Redis', 'Database Design', 'Graph Databases', 'Linux CLI', 'Docker'] },
  { name: 'Victor Rossi', current_role: 'Junior DevOps Engineer', experience_years: 2, location: 'Milan', skills: ['Docker', 'Linux CLI', 'Git', 'CI/CD', 'AWS', 'Python', 'Networking'] },
  { name: 'Wendy Cheng', current_role: 'Senior Data Scientist', experience_years: 8, location: 'Singapore', skills: ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Statistics', 'Pandas', 'MLOps', 'AWS', 'Docker', 'LLMs & Prompt Engineering', 'Data Visualization'] },
  { name: 'Xavier Moreau', current_role: 'Staff Engineer', experience_years: 14, location: 'Paris', skills: ['System Design', 'Microservices', 'Java', 'Go', 'Kubernetes', 'AWS', 'Event-Driven Architecture', 'Message Queues', 'PostgreSQL', 'Docker', 'Terraform', 'CI/CD'] },
  { name: 'Yuki Tanaka', current_role: 'Mobile Developer', experience_years: 5, location: 'Tokyo', skills: ['Swift', 'Kotlin', 'Flutter', 'React Native', 'Git', 'UI Design', 'JavaScript', 'TypeScript'] },
  { name: 'Zara Ahmed', current_role: 'Frontend Developer', experience_years: 3, location: 'Dubai', skills: ['Vue.js', 'JavaScript', 'TypeScript', 'HTML & CSS', 'CSS Architecture', 'Figma', 'Git', 'Accessibility'] },
  { name: 'Alex Rivera', current_role: 'Backend Developer', experience_years: 4, location: 'Mexico City', skills: ['Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Redis', 'Docker', 'Git', 'GraphQL', 'Testing (Backend)'] },
  { name: 'Beth Harmon', current_role: 'UI Designer', experience_years: 2, location: 'Brooklyn', skills: ['Figma', 'UI Design', 'UX Research', 'HTML & CSS', 'Programming Fundamentals'] },
  { name: 'Carlos Mendez', current_role: 'Junior Mobile Developer', experience_years: 1, location: 'São Paulo', skills: ['Kotlin', 'Java', 'Git', 'Programming Fundamentals', 'OOP'] },
  { name: 'Diana Wolf', current_role: 'DevOps Engineer', experience_years: 5, location: 'Amsterdam', skills: ['Docker', 'Kubernetes', 'Terraform', 'Azure', 'CI/CD', 'Linux CLI', 'Monitoring', 'Git', 'Python', 'Networking'] },
];

// Prerequisite relationships (from -> to: from is prerequisite of to)
const prerequisites = [
  ['Programming Fundamentals', 'Data Structures'],
  ['Programming Fundamentals', 'OOP'],
  ['Programming Fundamentals', 'Git'],
  ['Programming Fundamentals', 'HTML & CSS'],
  ['Programming Fundamentals', 'Python'],
  ['Programming Fundamentals', 'JavaScript'],
  ['Data Structures', 'Algorithms'],
  ['OOP', 'Java'],
  ['OOP', 'Design Systems'],
  ['HTML & CSS', 'JavaScript'],
  ['HTML & CSS', 'CSS Architecture'],
  ['HTML & CSS', 'Accessibility'],
  ['HTML & CSS', 'UI Design'],
  ['JavaScript', 'TypeScript'],
  ['JavaScript', 'React'],
  ['JavaScript', 'Vue.js'],
  ['JavaScript', 'Angular'],
  ['JavaScript', 'Node.js'],
  ['JavaScript', 'React Native'],
  ['React', 'Next.js'],
  ['React', 'React Native'],
  ['React', 'Testing (Frontend)'],
  ['TypeScript', 'Angular'],
  ['TypeScript', 'Next.js'],
  ['Node.js', 'Express.js'],
  ['Python', 'Django'],
  ['Python', 'Pandas'],
  ['Python', 'Statistics'],
  ['Java', 'Spring Boot'],
  ['Pandas', 'Machine Learning'],
  ['Statistics', 'Machine Learning'],
  ['Machine Learning', 'Deep Learning'],
  ['Machine Learning', 'MLOps'],
  ['Deep Learning', 'NLP'],
  ['Deep Learning', 'Computer Vision'],
  ['Deep Learning', 'LLMs & Prompt Engineering'],
  ['SQL', 'PostgreSQL'],
  ['SQL', 'Database Design'],
  ['HTTP & APIs', 'GraphQL'],
  ['HTTP & APIs', 'API Design'],
  ['HTTP & APIs', 'Express.js'],
  ['Linux CLI', 'Docker'],
  ['Linux CLI', 'Networking'],
  ['Docker', 'Kubernetes'],
  ['Docker', 'CI/CD'],
  ['Kubernetes', 'Terraform'],
  ['Networking', 'OWASP Top 10'],
  ['Networking', 'AWS'],
  ['AWS', 'Terraform'],
  ['Microservices', 'Event-Driven Architecture'],
  ['Microservices', 'Message Queues'],
  ['Microservices', 'System Design'],
  ['Database Design', 'Graph Databases'],
  ['UI Design', 'UX Research'],
  ['UI Design', 'Design Systems'],
  ['Figma', 'Design Systems'],
  ['CSS Architecture', 'Design Systems'],
  ['OWASP Top 10', 'Penetration Testing'],
  ['Cryptography', 'Authentication'],
  ['Go', 'Microservices'],
  ['Testing (Backend)', 'CI/CD'],
  ['Web Performance', 'Next.js'],
  ['Monitoring', 'MLOps'],
  ['Express.js', 'GraphQL'],
  ['PostgreSQL', 'Database Design'],
];

// Complementary skill pairs with strength
const complementary = [
  ['React', 'TypeScript', 0.9],
  ['React', 'Node.js', 0.8],
  ['Python', 'SQL', 0.85],
  ['Docker', 'CI/CD', 0.9],
  ['Kubernetes', 'Monitoring', 0.85],
  ['Machine Learning', 'Python', 0.95],
  ['AWS', 'Docker', 0.8],
  ['TypeScript', 'Next.js', 0.9],
  ['PostgreSQL', 'Redis', 0.75],
  ['UI Design', 'Figma', 0.95],
  ['UX Research', 'Accessibility', 0.8],
  ['Microservices', 'Docker', 0.9],
  ['Node.js', 'MongoDB', 0.7],
  ['React Native', 'TypeScript', 0.85],
  ['Deep Learning', 'Computer Vision', 0.85],
  ['NLP', 'LLMs & Prompt Engineering', 0.9],
  ['Terraform', 'AWS', 0.85],
  ['Java', 'Spring Boot', 0.95],
  ['HTML & CSS', 'JavaScript', 0.95],
  ['Git', 'CI/CD', 0.8],
  ['Go', 'Docker', 0.8],
  ['System Design', 'Microservices', 0.9],
  ['MLOps', 'Docker', 0.85],
  ['GraphQL', 'React', 0.8],
  ['Authentication', 'OWASP Top 10', 0.85],
];

// Role → Required Skills mappings
const roleSkills = {
  'Junior Frontend Developer': [
    ['HTML & CSS', 'core'], ['JavaScript', 'core'], ['Git', 'core'], ['React', 'preferred'], ['CSS Architecture', 'nice-to-have'],
  ],
  'Junior Backend Developer': [
    ['Programming Fundamentals', 'core'], ['Git', 'core'], ['HTTP & APIs', 'core'], ['SQL', 'preferred'], ['Python', 'preferred'], ['Linux CLI', 'nice-to-have'],
  ],
  'Junior Data Analyst': [
    ['SQL', 'core'], ['Python', 'core'], ['Statistics', 'core'], ['Pandas', 'preferred'], ['Data Visualization', 'preferred'], ['Git', 'nice-to-have'],
  ],
  'Junior DevOps Engineer': [
    ['Linux CLI', 'core'], ['Git', 'core'], ['Docker', 'core'], ['CI/CD', 'preferred'], ['Networking', 'preferred'], ['Python', 'nice-to-have'],
  ],
  'Junior Mobile Developer': [
    ['Programming Fundamentals', 'core'], ['Git', 'core'], ['OOP', 'core'], ['Kotlin', 'preferred'], ['Swift', 'preferred'],
  ],
  'UI Designer': [
    ['Figma', 'core'], ['UI Design', 'core'], ['HTML & CSS', 'preferred'], ['UX Research', 'nice-to-have'],
  ],
  'Frontend Developer': [
    ['HTML & CSS', 'core'], ['JavaScript', 'core'], ['React', 'core'], ['TypeScript', 'core'], ['Git', 'core'], ['CSS Architecture', 'preferred'], ['Testing (Frontend)', 'preferred'], ['Accessibility', 'nice-to-have'],
  ],
  'Backend Developer': [
    ['HTTP & APIs', 'core'], ['SQL', 'core'], ['Git', 'core'], ['Docker', 'preferred'], ['Testing (Backend)', 'preferred'], ['PostgreSQL', 'preferred'], ['Linux CLI', 'preferred'],
  ],
  'Full-Stack Developer': [
    ['JavaScript', 'core'], ['React', 'core'], ['Node.js', 'core'], ['SQL', 'core'], ['Git', 'core'], ['TypeScript', 'preferred'], ['Docker', 'preferred'], ['MongoDB', 'nice-to-have'], ['Express.js', 'preferred'],
  ],
  'Data Scientist': [
    ['Python', 'core'], ['Machine Learning', 'core'], ['Statistics', 'core'], ['Pandas', 'core'], ['SQL', 'core'], ['Data Visualization', 'preferred'], ['Deep Learning', 'preferred'], ['Git', 'preferred'],
  ],
  'DevOps Engineer': [
    ['Docker', 'core'], ['Kubernetes', 'core'], ['CI/CD', 'core'], ['Linux CLI', 'core'], ['AWS', 'preferred'], ['Terraform', 'preferred'], ['Monitoring', 'preferred'], ['Networking', 'preferred'], ['Git', 'core'],
  ],
  'Mobile Developer': [
    ['React Native', 'core'], ['JavaScript', 'core'], ['TypeScript', 'preferred'], ['Git', 'core'], ['Swift', 'preferred'], ['Kotlin', 'preferred'],
  ],
  'Security Engineer': [
    ['OWASP Top 10', 'core'], ['Linux CLI', 'core'], ['Networking', 'core'], ['Cryptography', 'core'], ['Authentication', 'preferred'], ['Python', 'preferred'], ['Penetration Testing', 'preferred'],
  ],
  'UX Designer': [
    ['UX Research', 'core'], ['Figma', 'core'], ['UI Design', 'core'], ['Design Systems', 'preferred'], ['Accessibility', 'preferred'], ['HTML & CSS', 'nice-to-have'],
  ],
  'Database Administrator': [
    ['SQL', 'core'], ['PostgreSQL', 'core'], ['Database Design', 'core'], ['MongoDB', 'preferred'], ['Redis', 'preferred'], ['Linux CLI', 'preferred'],
  ],
  'Senior Frontend Engineer': [
    ['React', 'core'], ['TypeScript', 'core'], ['Next.js', 'core'], ['CSS Architecture', 'core'], ['Web Performance', 'core'], ['Testing (Frontend)', 'core'], ['Accessibility', 'preferred'], ['Design Systems', 'preferred'], ['System Design', 'nice-to-have'],
  ],
  'Senior Backend Engineer': [
    ['Microservices', 'core'], ['System Design', 'core'], ['Docker', 'core'], ['PostgreSQL', 'core'], ['Testing (Backend)', 'core'], ['API Design', 'core'], ['Message Queues', 'preferred'], ['CI/CD', 'preferred'],
  ],
  'Senior Full-Stack Engineer': [
    ['React', 'core'], ['Node.js', 'core'], ['TypeScript', 'core'], ['PostgreSQL', 'core'], ['Docker', 'core'], ['AWS', 'preferred'], ['System Design', 'preferred'], ['GraphQL', 'preferred'], ['CI/CD', 'preferred'],
  ],
  'Senior Data Scientist': [
    ['Machine Learning', 'core'], ['Deep Learning', 'core'], ['Python', 'core'], ['Statistics', 'core'], ['NLP', 'preferred'], ['MLOps', 'preferred'], ['Computer Vision', 'preferred'], ['LLMs & Prompt Engineering', 'preferred'],
  ],
  'Senior DevOps Engineer': [
    ['Kubernetes', 'core'], ['Terraform', 'core'], ['AWS', 'core'], ['System Design', 'core'], ['Monitoring', 'core'], ['CI/CD', 'core'], ['Networking', 'core'], ['Docker', 'core'],
  ],
  'ML Engineer': [
    ['Machine Learning', 'core'], ['Deep Learning', 'core'], ['Python', 'core'], ['Docker', 'core'], ['MLOps', 'core'], ['AWS', 'preferred'], ['Kubernetes', 'preferred'], ['System Design', 'preferred'],
  ],
  'Cloud Architect': [
    ['AWS', 'core'], ['System Design', 'core'], ['Terraform', 'core'], ['Kubernetes', 'core'], ['Networking', 'core'], ['Microservices', 'core'], ['Monitoring', 'preferred'], ['Docker', 'core'],
  ],
  'Engineering Manager': [
    ['System Design', 'core'], ['Microservices', 'preferred'], ['CI/CD', 'preferred'], ['API Design', 'preferred'],
  ],
  'Staff Engineer': [
    ['System Design', 'core'], ['Microservices', 'core'], ['Event-Driven Architecture', 'core'], ['API Design', 'core'], ['Kubernetes', 'preferred'], ['AWS', 'preferred'],
  ],
  'Principal Engineer': [
    ['System Design', 'core'], ['Microservices', 'core'], ['Event-Driven Architecture', 'core'],
  ],
  'VP of Engineering': [
    ['System Design', 'core'],
  ],
  'Head of Data': [
    ['Machine Learning', 'core'], ['System Design', 'core'], ['MLOps', 'preferred'],
  ],
  'Head of Design': [
    ['Design Systems', 'core'], ['UX Research', 'core'], ['UI Design', 'core'],
  ],
  'CTO': [
    ['System Design', 'core'], ['Microservices', 'preferred'], ['AWS', 'preferred'],
  ],
};

// Career progression (from -> to)
const careerPaths = [
  ['Junior Frontend Developer', 'Frontend Developer'],
  ['Frontend Developer', 'Senior Frontend Engineer'],
  ['Senior Frontend Engineer', 'Staff Engineer'],
  ['Senior Frontend Engineer', 'Engineering Manager'],
  ['Junior Backend Developer', 'Backend Developer'],
  ['Backend Developer', 'Senior Backend Engineer'],
  ['Backend Developer', 'Full-Stack Developer'],
  ['Full-Stack Developer', 'Senior Full-Stack Engineer'],
  ['Senior Backend Engineer', 'Staff Engineer'],
  ['Senior Backend Engineer', 'Engineering Manager'],
  ['Senior Full-Stack Engineer', 'Staff Engineer'],
  ['Senior Full-Stack Engineer', 'Engineering Manager'],
  ['Staff Engineer', 'Principal Engineer'],
  ['Principal Engineer', 'VP of Engineering'],
  ['Engineering Manager', 'VP of Engineering'],
  ['VP of Engineering', 'CTO'],
  ['Junior Data Analyst', 'Data Scientist'],
  ['Data Scientist', 'Senior Data Scientist'],
  ['Senior Data Scientist', 'ML Engineer'],
  ['Senior Data Scientist', 'Head of Data'],
  ['ML Engineer', 'Head of Data'],
  ['Head of Data', 'CTO'],
  ['Junior DevOps Engineer', 'DevOps Engineer'],
  ['DevOps Engineer', 'Senior DevOps Engineer'],
  ['Senior DevOps Engineer', 'Cloud Architect'],
  ['Cloud Architect', 'Staff Engineer'],
  ['Cloud Architect', 'CTO'],
  ['Junior Mobile Developer', 'Mobile Developer'],
  ['Mobile Developer', 'Senior Frontend Engineer'],
  ['UI Designer', 'UX Designer'],
  ['UX Designer', 'Head of Design'],
  ['Database Administrator', 'Senior Backend Engineer'],
  ['Security Engineer', 'Senior Backend Engineer'],
  ['Security Engineer', 'Cloud Architect'],
];

// Domain relationships
const domainRelations = [
  ['Frontend', 'Design'],
  ['Frontend', 'Mobile'],
  ['Backend', 'Database'],
  ['Backend', 'Cloud'],
  ['Backend', 'Security'],
  ['Data Science', 'Backend'],
  ['DevOps', 'Cloud'],
  ['DevOps', 'Security'],
  ['Cloud', 'Security'],
  ['Foundations', 'Frontend'],
  ['Foundations', 'Backend'],
];

/* ===========================
   SEED EXECUTION
   =========================== */

async function seed() {
  const session = driver.session();

  try {
    console.log('🗑️  Clearing existing data…');
    await session.run('MATCH (n) DETACH DELETE n');

    console.log('📐 Creating constraints & indexes…');
    const constraints = [
      'CREATE CONSTRAINT IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS FOR (r:Role) REQUIRE r.title IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS FOR (d:Domain) REQUIRE d.name IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS FOR (p:Professional) REQUIRE p.name IS UNIQUE',
    ];
    for (const c of constraints) {
      try { await session.run(c); } catch { /* constraint may already exist */ }
    }

    console.log('🌐 Creating Domains…');
    for (const d of domains) {
      await session.run(
        'CREATE (d:Domain {name: $name, description: $description, color: $color})',
        d
      );
    }

    console.log('⚡ Creating Skills…');
    for (const s of skills) {
      const { domains: skillDomains, ...props } = s;
      await session.run('CREATE (s:Skill $props)', { props });
      for (const dName of skillDomains) {
        await session.run(
          `MATCH (s:Skill {name: $skillName}), (d:Domain {name: $domainName})
           CREATE (s)-[:BELONGS_TO]->(d)`,
          { skillName: s.name, domainName: dName }
        );
      }
    }

    console.log('👔 Creating Roles…');
    for (const r of roles) {
      await session.run('CREATE (r:Role $props)', { props: r });
    }

    console.log('📚 Creating Learning Resources…');
    for (const lr of resources) {
      const { teaches, ...props } = lr;
      await session.run('CREATE (lr:LearningResource $props)', { props });
      for (const skillName of teaches) {
        await session.run(
          `MATCH (lr:LearningResource {title: $title}), (s:Skill {name: $skillName})
           CREATE (lr)-[:TEACHES]->(s)`,
          { title: lr.title, skillName }
        );
      }
    }

    console.log('🔗 Creating Prerequisite relationships…');
    for (const [from, to] of prerequisites) {
      await session.run(
        `MATCH (s1:Skill {name: $from}), (s2:Skill {name: $to})
         CREATE (s1)-[:PREREQUISITE_OF]->(s2)`,
        { from, to }
      );
    }

    console.log('🤝 Creating Complementary relationships…');
    for (const [s1, s2, strength] of complementary) {
      await session.run(
        `MATCH (a:Skill {name: $s1}), (b:Skill {name: $s2})
         CREATE (a)-[:COMPLEMENTARY_TO {strength: $strength}]->(b)`,
        { s1, s2, strength }
      );
    }

    console.log('📋 Creating Role → Skill requirements…');
    for (const [roleTitle, reqs] of Object.entries(roleSkills)) {
      for (const [skillName, importance] of reqs) {
        await session.run(
          `MATCH (r:Role {title: $roleTitle}), (s:Skill {name: $skillName})
           CREATE (r)-[:REQUIRES {importance: $importance}]->(s)`,
          { roleTitle, skillName, importance }
        );
      }
    }

    console.log('🚀 Creating Career progression paths…');
    for (const [from, to] of careerPaths) {
      await session.run(
        `MATCH (r1:Role {title: $from}), (r2:Role {title: $to})
         CREATE (r1)-[:LEADS_TO]->(r2)`,
        { from, to }
      );
    }

    console.log('👥 Creating Professionals…');
    for (const p of professionals) {
      const { skills: profSkills, ...props } = p;
      await session.run('CREATE (p:Professional $props)', { props });

      // HAS_SKILL with proficiency based on experience
      for (let i = 0; i < profSkills.length; i++) {
        const proficiency = Math.max(1, Math.min(5, Math.round(props.experience_years / 3 + Math.random() * 2)));
        await session.run(
          `MATCH (p:Professional {name: $name}), (s:Skill {name: $skillName})
           CREATE (p)-[:HAS_SKILL {proficiency: $proficiency}]->(s)`,
          { name: p.name, skillName: profSkills[i], proficiency }
        );
      }

      // WORKS_AS
      await session.run(
        `MATCH (p:Professional {name: $name}), (r:Role {title: $role})
         CREATE (p)-[:WORKS_AS]->(r)`,
        { name: p.name, role: p.current_role }
      );
    }

    console.log('🌐 Creating Domain relationships…');
    for (const [d1, d2] of domainRelations) {
      await session.run(
        `MATCH (a:Domain {name: $d1}), (b:Domain {name: $d2})
         CREATE (a)-[:RELATED_TO]->(b)`,
        { d1, d2 }
      );
    }

    // Final count
    const countResult = await session.run(`
      MATCH (n)
      OPTIONAL MATCH ()-[r]->()
      RETURN count(DISTINCT n) AS nodes, count(DISTINCT r) AS rels
    `);
    const nodes = countResult.records[0].get('nodes').toNumber();
    const rels = countResult.records[0].get('rels').toNumber();

    console.log(`\n✅ Seed complete!`);
    console.log(`   Nodes: ${nodes}`);
    console.log(`   Relationships: ${rels}`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    throw err;
  } finally {
    await session.close();
    await driver.close();
  }
}

seed().catch(() => process.exit(1));
