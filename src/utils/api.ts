import { API_URL } from "../constants/api";

export const fetchAPI = async (paths: string[] = [], compare: boolean = true) =>
  fetch(`${API_URL}${paths.join("/")}.json`)
    .then((response) => response.json())
    .then((data) =>
      !compare
        ? data
        : data
            .map(({ id: value, name: label, ...item }) => ({
              label,
              value,
              ...item,
            }))
            .sort((a, z) => a.label.localeCompare(z.label))
    );
