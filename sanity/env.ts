export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-07'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skSkQemYAYuo32dFbbUzZLn2ZII5WPeGNVIRYrtnJC5yoVarv784aV4eKFbvLI5aaCmWxWWZtAfFzKFZIHZIFZ6VKu6c3hIzcLk2Jl21lPqj1XW6osv8DesNaFvn0tFLqBGFNohIhiWNctQLY0X35RJ58kMG8vtkuvkZW3vlUXBzWWYDHsBF",
  'Missing environment variable: NEXT_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
