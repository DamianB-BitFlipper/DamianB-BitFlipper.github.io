#!/usr/bin/env python3
"""Fetch GitHub project data via GraphQL and write to content/projects.json."""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime
from typing import Any, Dict, List, Optional

API_URL = "https://api.github.com/graphql"

PINNED_QUERY = """
query ($login: String!, $first: Int!, $after: String) {
  user(login: $login) {
    pinnedItems(first: $first, types: REPOSITORY, after: $after) {
      nodes {
        ... on Repository {
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
"""

REPOSITORIES_QUERY = """
query ($login: String!, $first: Int!, $after: String) {
  user(login: $login) {
    repositories(first: $first, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}, after: $after) {
      nodes {
        name
        description
        stargazerCount
        primaryLanguage { name }
        updatedAt
        url
        homepageUrl
        repositoryTopics(first: 20) { nodes { topic { name } } }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
"""

def strip_hours_time(timestamp: str) -> str:
    """Return only the YYYY-MM-DD portion of an ISO 8601 timestamp."""
    try:
        return timestamp.split("T", 1)[0]
    except Exception:
        return timestamp

def run_graphql(query: str, variables: Dict[str, Any], token: str) -> Dict[str, Any]:
    payload = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"bearer {token}",
    }
    request = urllib.request.Request(API_URL, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"GitHub API request failed: {error.code} {error.reason}\n{body}") from error


def extract_nodes(section: Optional[Dict[str, Any]], key: str = "nodes") -> List[Dict[str, Any]]:
    if not section:
        return []
    nodes = section.get(key) or []
    if not isinstance(nodes, list):
        return []
    return nodes


def fetch_paginated(query: str, login: str, token: str, page_size: int) -> List[Dict[str, Any]]:
    nodes: List[Dict[str, Any]] = []
    after: Optional[str] = None
    while True:
        variables = {"login": login, "first": page_size, "after": after}
        result = run_graphql(query, variables, token)
        errors = result.get("errors")
        if errors:
            raise RuntimeError(f"GitHub API returned errors: {errors}")
        user = (result.get("data") or {}).get("user")
        if user is None:
            raise RuntimeError(f"User '{login}' not found in API response")
        section = user.get("pinnedItems") if "pinnedItems" in query else user.get("repositories")
        if section is None:
            break
        nodes.extend(extract_nodes(section))
        page_info = section.get("pageInfo") or {}
        if not page_info.get("hasNextPage"):
            break
        after = page_info.get("endCursor")
        if not after:
            break
    return nodes


def parse_args() -> argparse.Namespace:
    default_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    parser = argparse.ArgumentParser(description="Update content/projects.json using GitHub GraphQL API.")
    parser.add_argument("--login", default="DamianB-BitFlipper", help="GitHub username to query")
    parser.add_argument(
        "--token-env",
        default="GITHUB_TOKEN",
        help="Environment variable that contains the GitHub token",
    )
    parser.add_argument(
        "--output",
        default=os.path.join(default_root, "content", "projects.json"),
        help="Output JSON file path",
    )
    parser.add_argument("--pinned-page-size", type=int, default=6, help="Pinned items page size")
    parser.add_argument("--repos-page-size", type=int, default=100, help="Repositories page size")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    token = os.environ.get(args.token_env)
    if not token:
        raise SystemExit(f"Environment variable '{args.token_env}' must be set with a GitHub token")

    pinned_nodes = fetch_paginated(PINNED_QUERY, args.login, token, args.pinned_page_size)
    repo_nodes = fetch_paginated(REPOSITORIES_QUERY, args.login, token, args.repos_page_size)

    # Strip the hours times for the updated at for all repositories
    # since we do not need such degree of precision
    for repo in repo_nodes:
        ts = repo.get("updatedAt")
        if ts:
            repo["updatedAt"] = strip_hours_time(ts)

    output_data = {
        "data": {
            "user": {
                "pinnedItems": {"nodes": pinned_nodes},
                "repositories": {"nodes": repo_nodes},
            }
        }
    }

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as handle:
        json.dump(output_data, handle, indent=2, ensure_ascii=False)
        handle.write("\n")

    print(
        f"Saved {len(pinned_nodes)} pinned repositories and {len(repo_nodes)} repositories to {args.output}",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
