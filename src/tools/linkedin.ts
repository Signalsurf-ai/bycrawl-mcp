import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bycrawlGet } from "../client.js";

export function registerLinkedinTools(server: McpServer) {
  server.tool(
    "linkedin_get_company",
    "Get LinkedIn company profile",
    { companyId: z.string().describe("Company ID or vanity name (e.g. 'microsoft')") },
    async ({ companyId }) => bycrawlGet(`/linkedin/companies/${companyId}`),
  );

  server.tool(
    "linkedin_get_company_jobs",
    "Get job listings for a LinkedIn company",
    {
      companyId: z.string().describe("Company ID or vanity name"),
      count: z.number().optional().describe("Number of jobs (max 100)"),
      offset: z.number().optional().describe("Pagination offset"),
    },
    async ({ companyId, count, offset }) => bycrawlGet(`/linkedin/companies/${companyId}/jobs`, { count, offset }),
  );

  server.tool(
    "linkedin_search_jobs",
    "Search LinkedIn job listings by keyword",
    {
      query: z.string().describe("Search keywords (e.g. 'software engineer')"),
      location: z.string().optional().describe("Location filter (e.g. 'San Francisco')"),
      count: z.number().optional().describe("Number of results (max 100)"),
      offset: z.number().optional().describe("Pagination offset"),
    },
    async ({ query, location, count, offset }) => bycrawlGet("/linkedin/jobs/search", { query, location, count, offset }),
  );

  server.tool(
    "linkedin_get_job",
    "Get a LinkedIn job posting by ID",
    { jobId: z.string().describe("LinkedIn job ID") },
    async ({ jobId }) => bycrawlGet(`/linkedin/jobs/${jobId}`),
  );

  server.tool(
    "linkedin_get_post",
    "Get a LinkedIn post by ID",
    { postId: z.string().describe("LinkedIn post or article ID") },
    async ({ postId }) => bycrawlGet(`/linkedin/posts/${postId}`),
  );

  server.tool(
    "linkedin_get_user",
    "Get LinkedIn user profile by username",
    { username: z.string().describe("LinkedIn username or profile URL slug") },
    async ({ username }) => bycrawlGet(`/linkedin/users/${username}`),
  );
}
