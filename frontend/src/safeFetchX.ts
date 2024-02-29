type ResponseX =
  | {
      success: true;
      status: number;
      data: any;
    }
  | {
      success: false;
      status: number | null;
    };

export const safeFetchX = async (
  method: string,
  url: string,
  data?: any
): Promise<ResponseX> => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: data
        ? {
            "Content-Type": "application/json",
          }
        : {},
      body: data ? JSON.stringify(data) : undefined,
    });
    if (response.status > 299) {
      return { success: false, status: response.status };
    }
    const responseData = await response.json();
    return { success: true, status: 200, data: responseData };
  } catch (error) {
    return { success: false, status: null };
  }
};
