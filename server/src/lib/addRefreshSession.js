import {
  getCountRefreshSessions,
  createRefreshSession,
  removeRefreshSessionById,
} from '../services/account.service';
import { maxRefreshSessionsCount } from '../config/env';

export async function addRefreshSession(refreshSession) {
  if (await isValidSessionCount(refreshSession.userId)) {
    await _addRefreshSession(refreshSession);
  } else {
    await wipeAllUserRefreshSessions(refreshSession.userId);
    await _addRefreshSession(refreshSession);
  }
}

async function isValidSessionCount(userId) {
  const exsistingSessionsCount = await getCountRefreshSessions(userId);

  return exsistingSessionsCount < maxRefreshSessionsCount;
}

async function _addRefreshSession(refreshSession) {
  await createRefreshSession(refreshSession);
}

async function wipeAllUserRefreshSessions(userId) {
  return await removeRefreshSessionById(userId);
}
