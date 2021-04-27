import ApiClient from './apiClient';


async function getApiClientWithSession() {
    const apiClient = new ApiClient();
    await apiClient.login();

    return apiClient;
}

export { getApiClientWithSession }
