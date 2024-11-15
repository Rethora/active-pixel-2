import { ipcMain } from 'electron';
import store from '../store';
import { HandlerPayload, HandlerReturn } from '../../shared/types/ipc';
import { getSuggestionsWithAddProps } from '../../shared/util/suggestion';

export default () => {
  ipcMain.handle(
    'get-all-suggestions-with-add-props',
    (): HandlerReturn<'get-all-suggestions-with-add-props'> => {
      const suggestions = getSuggestionsWithAddProps({
        preferences: store.get('suggestionPreferences', {}),
      });
      return suggestions;
    },
  );

  ipcMain.handle(
    'get-suggestion-with-add-props-by-id',
    (
      _,
      payload: HandlerPayload<'get-suggestion-with-add-props-by-id'>,
    ): HandlerReturn<'get-suggestion-with-add-props-by-id'> => {
      const suggestions = getSuggestionsWithAddProps({
        preferences: store.get('suggestionPreferences', {}),
      });
      const foundSuggestion = suggestions.find(
        (suggestion) => suggestion.id === payload,
      );
      if (!foundSuggestion) {
        throw new Error('Suggestion not found');
      }
      return foundSuggestion;
    },
  );

  ipcMain.handle(
    'add-liked-suggestion',
    (
      _,
      payload: HandlerPayload<'add-liked-suggestion'>,
    ): HandlerReturn<'add-liked-suggestion'> => {
      store.set(`suggestionPreferences.${payload}`, true);
      const suggestionPreferences = store.get('suggestionPreferences', {});
      return Object.keys(suggestionPreferences).filter(
        (k) => suggestionPreferences[k] === true,
      );
    },
  );

  ipcMain.handle(
    'add-disliked-suggestion',
    (
      _,
      payload: HandlerPayload<'add-disliked-suggestion'>,
    ): HandlerReturn<'add-disliked-suggestion'> => {
      store.set(`suggestionPreferences.${payload}`, false);
      return Object.keys(store.get('suggestionPreferences', {})).filter((k) =>
        store.get(`suggestionPreferences.${k}`, false),
      );
    },
  );

  ipcMain.handle(
    'remove-feedback',
    (
      _,
      payload: HandlerPayload<'remove-feedback'>,
    ): HandlerReturn<'remove-feedback'> => {
      const suggestionPreferences = store.get('suggestionPreferences', {});
      if (payload in suggestionPreferences) {
        delete suggestionPreferences[payload];
      }
      store.set('suggestionPreferences', suggestionPreferences);
    },
  );
};
