const BASE_URL =  process.env.NEXT_PUBLIC_BASE_URL; 

async function signIn({ username, password }: any) {
  try {
    const res = await fetch(`${BASE_URL}/auth/signIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    const data = await res.json();

    if (data?.status) {
      return {
        error: data?.message,
      };
    }
    return data;
  } catch (error) {
    return { error: error };
  }
}

async function signUp({ username, password }: any) {
  try {
    const res = await fetch(`${BASE_URL}/auth/signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (!res.ok) {
      const data = await res.json();

      if (data?.status) {
        return {
          error: data?.message,
        };
      }
    }
    return {};
  } catch (error) {
    console.log(error);
    return { error: "error" };
  }
}

export { signIn, signUp };