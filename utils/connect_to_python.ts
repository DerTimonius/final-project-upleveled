import { execaCommand } from 'execa';

// const { execaCommand } = require('execa');

export async function checkRecommendations(
  selectedMovieIds: string,
  options: string,
  preferences: boolean,
) {
  const { stdout } = await execaCommand(
    `python ./utils/python/recommend.py ${selectedMovieIds} ${options} ${preferences}`,
  );
  return stdout;
}
export async function checkSearch(searchItem: string) {
  const { stdout } = await execaCommand(
    `python ./utils/python/search.py ${searchItem}`,
  );
  return stdout;
}
