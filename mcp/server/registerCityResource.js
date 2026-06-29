import { ResourceTemplate } from '@modelcontextprotocol/server';

export function registerCityResource(server) {
  const resourceUri = 'https://example.com/cities';
  const description = {
    title: 'Supported Cities',
    name: 'supported-cities',
    uri: resourceUri,
    description: 'List of supported cities with optional country filtering',
    mimeType: 'application/json',
  }

  server.registerResource(
    'supported-cities',
    new ResourceTemplate(`${resourceUri}{?country}`, {
      list: async () => ({
        resources: [
          description,
        ],
      }),
    }),
    description,
    async (uri) => {
      // Vollständige Liste
      const cities = [
        { city: 'Berlin', country: 'Germany' },
        { city: 'New York', country: 'USA' },
        { city: 'Los Angeles', country: 'USA' },
      ];

      // Optionaler Filter: ?country=USA
      const country = uri.searchParams.get('country');
      const filtered = country
        ? cities.filter(
          (c) => c.country.toLowerCase() === country.toLowerCase(),
        )
        : cities;

      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(filtered, null, 2),
          },
        ],
      };
    },
  );
}
