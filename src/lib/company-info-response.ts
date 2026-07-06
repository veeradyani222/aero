export async function readCompanyInfoResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.toLowerCase().includes('application/json');

  if (!isJson) {
    const text = await response.text();
    const details = text.trim() || response.statusText || 'Unexpected non-JSON response';
    throw new Error(`${response.status} ${response.statusText}: ${details}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.details || response.statusText || 'Failed to get company info');
  }

  return data;
}
