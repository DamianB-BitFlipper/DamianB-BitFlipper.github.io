const GITHUB_USERNAME = 'DamianB-BitFlipper';
const PROJECTS_PER_PAGE = 10;
const GITHUB_API_TOKEN = process.env.NEXT_PUBLIC_GITHUB_API_TOKEN || '';

const requireToken = () => {
  if (!GITHUB_API_TOKEN) {
    throw new Error('GitHub token is required to access the GitHub API.');
  }
};

const buildGithubHeaders = () => {
  const headers = { Accept: 'application/vnd.github+json' };
  if (GITHUB_API_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_API_TOKEN}`;
  }
  return headers;
};

const buildGithubGraphqlHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (GITHUB_API_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_API_TOKEN}`;
  }
  return headers;
};

const fetchPinnedRepositories = async ({ username = GITHUB_USERNAME, signal } = {}) => {
  requireToken();
  const query = `{
    user(login: "${username}") {
      pinnedItems(first: 10, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            nameWithOwner
            url
            description
            stargazerCount
            primaryLanguage { name }
            updatedAt
            issues(states: OPEN) { totalCount }
            homepageUrl
            topics: repositoryTopics(first: 5) {
              nodes {
                topic { name }
              }
            }
          }
        }
      }
    }
  }`;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: buildGithubGraphqlHeaders(),
    body: JSON.stringify({ query }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL API responded with ${response.status}`);
  }
  const data = await response.json();
  if (data?.errors?.length) {
    throw new Error(data.errors.map(err => err.message).join(', '));
  }
  const nodes = data?.data?.user?.pinnedItems?.nodes || [];
  return nodes.map(node => ({
    id: node.nameWithOwner,
    name: node.name,
    html_url: node.url,
    description: node.description,
    stargazers_count: node.stargazerCount,
    language: node.primaryLanguage?.name,
    updated_at: node.updatedAt,
    open_issues_count: node.issues?.totalCount || 0,
    homepage: node.homepageUrl,
    topics: (node.topics?.nodes || []).map(topicNode => topicNode.topic?.name).filter(Boolean),
  }));
};

const getRestRequestConfig = ({ sortMode, filterLanguage, page, username = GITHUB_USERNAME }) => {
  const useSearchEndpoint = filterLanguage !== 'All' || sortMode === 'stars';
  if (useSearchEndpoint) {
    const queryParts = [`user:${username}`];
    if (filterLanguage !== 'All') {
      queryParts.push(`language:${filterLanguage}`);
    }
    const params = new URLSearchParams({
      q: queryParts.join(' '),
      per_page: PROJECTS_PER_PAGE.toString(),
      page: page.toString(),
      sort: sortMode === 'stars' ? 'stars' : 'updated',
      order: sortMode === 'alpha' ? 'asc' : 'desc'
    });
    return {
      url: `https://api.github.com/search/repositories?${params.toString()}`,
      transform: data => data?.items || [],
    };
  }

  const params = new URLSearchParams({
    per_page: PROJECTS_PER_PAGE.toString(),
    page: page.toString(),
    sort: sortMode === 'alpha' ? 'full_name' : 'updated',
    direction: sortMode === 'alpha' ? 'asc' : 'desc'
  });
  return {
    url: `https://api.github.com/users/${username}/repos?${params.toString()}`,
    transform: data => data || [],
  };
};

const fetchUserRepositories = async ({ username = GITHUB_USERNAME, perPage = 100, maxPages = 5, signal } = {}) => {
  requireToken();
  const repositories = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const params = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
      sort: 'updated'
    });
    const response = await fetch(`https://api.github.com/users/${username}/repos?${params.toString()}`, {
      headers: buildGithubHeaders(),
      signal,
    });
    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }
    const data = await response.json();
    repositories.push(...data);
    if (data.length < perPage) {
      break;
    }
  }
  return repositories.map(repo => ({
    id: repo.full_name,
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description,
    stargazers_count: repo.stargazers_count || 0,
    language: repo.language,
    updated_at: repo.updated_at,
    homepage: repo.homepage,
  }));
};

export {
  GITHUB_USERNAME,
  PROJECTS_PER_PAGE,
  buildGithubHeaders,
  buildGithubGraphqlHeaders,
  fetchPinnedRepositories,
  getRestRequestConfig,
  fetchUserRepositories,
};
