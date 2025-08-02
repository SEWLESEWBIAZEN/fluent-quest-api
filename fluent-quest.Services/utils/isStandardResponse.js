export function isStandardResponse(obj) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'statusCode' in obj &&
    'success' in obj &&
    'message' in obj &&
    'data' in obj
  );
}
