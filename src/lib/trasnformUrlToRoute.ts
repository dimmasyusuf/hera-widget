interface TransformedUrl {
  route: string;
  additionalData: string;
}

export const transformUrl = (url: string): TransformedUrl => {
  try {
    const [path, queryString] = url.split("?");

    const params: { [key: string]: string } = {};

    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    const transformed: TransformedUrl = {
      route: path,
      additionalData: JSON.stringify(params)
    };

    return transformed;
  } catch (error) {
    throw new Error(`Failed to transform URL: ${error}`);
  }
};
