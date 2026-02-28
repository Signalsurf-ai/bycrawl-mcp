import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bycrawlGet } from "../client.js";

export function registerJob104Tools(server: McpServer) {
  server.tool(
    "job104_search_jobs",
    "Search 104.com.tw job listings",
    {
      q: z.string().optional().describe("Search keyword"),
      welfare: z.string().optional().describe("Welfare code filter"),
      area: z.string().optional().describe("Area code filter (e.g. 6001001000)"),
      page: z.number().optional().describe("Page number (default 1)"),
      count: z.number().optional().describe("Results per page (max 100, default 20)"),
    },
    async ({ q, welfare, area, page, count }) => bycrawlGet("/job104/jobs/search", { q, welfare, area, page, count }),
  );

  server.tool(
    "job104_get_company",
    "Get company details from 104.com.tw",
    { companyId: z.string().describe("104.com.tw company ID") },
    async ({ companyId }) => bycrawlGet(`/job104/companies/${companyId}`),
  );

  server.tool(
    "job104_get_job",
    "Get job details (with contact email) from 104.com.tw",
    { jobId: z.string().describe("104.com.tw job ID") },
    async ({ jobId }) => bycrawlGet(`/job104/jobs/${jobId}`),
  );
}
