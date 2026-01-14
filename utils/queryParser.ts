
import { FilterState, Status, Priority } from '../types';

export const parseFilterQuery = (query: string): Partial<FilterState> => {
  const filters: Partial<FilterState> = {
    status: [],
    priority: [],
    assignees: [],
    search: '',
  };

  const parts = query.split(/\s+/);
  const searchParts: string[] = [];

  parts.forEach((part) => {
    if (part.includes(':')) {
      const [key, value] = part.split(':');
      const normalizedValue = value.toLowerCase();

      switch (key.toLowerCase()) {
        case 'is':
        case 'status':
          if (normalizedValue === 'done') filters.status?.push(Status.DONE);
          if (normalizedValue === 'todo') filters.status?.push(Status.TODO);
          if (normalizedValue === 'backlog') filters.status?.push(Status.BACKLOG);
          if (normalizedValue === 'progress') filters.status?.push(Status.IN_PROGRESS);
          break;
        case 'priority':
          if (normalizedValue === 'urgent') filters.priority?.push(Priority.URGENT);
          if (normalizedValue === 'high') filters.priority?.push(Priority.HIGH);
          if (normalizedValue === 'medium') filters.priority?.push(Priority.MEDIUM);
          if (normalizedValue === 'low') filters.priority?.push(Priority.LOW);
          break;
        case 'assigned':
          if (normalizedValue === 'me') filters.assignees?.push('u-1'); // Mock current user ID
          break;
      }
    } else {
      searchParts.push(part);
    }
  });

  filters.search = searchParts.join(' ').trim();
  return filters;
};
