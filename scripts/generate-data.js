
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDirectory = path.join(__dirname, '../content');
const outputDirectory = path.join(__dirname, '../components');

function getProjects() {
  const projectsDirectory = path.join(contentDirectory, 'projects');
  if (!fs.existsSync(projectsDirectory)) return [];
  const filenames = fs.readdirSync(projectsDirectory);

  const projects = filenames.map((filename) => {
    const filePath = path.join(projectsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: filename.replace(/\.md$/, ''),
      ...data,
      content
    };
  });

  return projects.sort((a, b) => (a.importance || 10) - (b.importance || 10));
}

function getPosts() {
  const postsDirectory = path.join(contentDirectory, 'posts');
  if (!fs.existsSync(postsDirectory)) return [];
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
    const date = data.date ? new Date(data.date).toISOString() : (dateMatch ? dateMatch[1] : '');

    return {
      slug: filename.replace(/\.md$/, ''),
      date,
      ...data,
      content
    };
  });

  return posts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

const projects = getProjects();
const posts = getPosts();

const fileContent = `
export const projects = ${JSON.stringify(projects, null, 2)};
export const posts = ${JSON.stringify(posts, null, 2)};
`;

fs.writeFileSync(path.join(outputDirectory, 'ubuntu_data.js'), fileContent);
console.log('Data generated successfully at components/ubuntu_data.js');
