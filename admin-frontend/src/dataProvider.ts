import { fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }

  const token = localStorage.getItem('authToken');
  
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }

  return fetchUtils.fetchJson(url, options);
};

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL;
const dataProvider = jsonServerProvider(apiUrl, httpClient);

const customDataProvider = {
  ...dataProvider,

  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { order, field } = params.sort;
    const query = {
      order: order,               // ASC o DESC
      page: page,                 // Número de página
      take: perPage,              // Tamaño de página
      sort: field,
    };

    const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
    return httpClient(url).then(({ json }) => ({
      data: json.data,           // Datos de la respuesta (array de skills)
      total: json.meta.itemCount // Total de registros desde el campo meta
    }));
  },
  update: (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const options = {
      method: 'PUT',
      body: JSON.stringify(params.data),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };

    return httpClient(url, options).then(({ status, json }) => {
      if (status === 202 || !json.data) {
        return { data: { ...params.data, id: params.id } }; 
      }

      return { data: json.data };
    });
  },
  getMany: (resource, params) => {
    const query = {
      filter: { id: params.ids }
    };

    const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
    
    return httpClient(url).then(({ json }) => {
      if (!json || !Array.isArray(json.data)) {
        throw new Error('Invalid response format for getMany, expected an array');
      }

      return { data: json.data, total: json.meta.itemCount };
    });
  },

};

export default customDataProvider;
