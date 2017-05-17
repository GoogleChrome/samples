package com.google.websession;

import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.account.User;
import com.google.account.UserManager;
import com.google.account.filter.FilterUtil;
import com.google.account.filter.SessionInfo;
import com.google.account.filter.SessionUtil;
import com.google.common.base.Preconditions;
import com.google.dosidos.AppContextListener;
import com.google.dosidos.LaunchHook;
import com.google.dosidos.Settings;
import com.google.dosidos.TwoTokenHandler;
import com.google.dosidos.TwoTokenManager;

public class MyAppContextListener extends AppContextListener {

  @Override
  public TwoTokenManager constructTwoTokenManager() {
    Settings settings = new Settings.Builder()
        .latLifetime(900)
        .aesKey("80a003040c0807d00f01075090123456")
        .build();
    
    return new TwoTokenManager(
        settings, new MyTwoTokenHandler(), new MyLaunchHook());
  }

  private static class MyTwoTokenHandler implements TwoTokenHandler {
    private static Random random = new Random();

    @Override
    public boolean hasBigAccountChangeSince(String userId, long issueAt) {
      Preconditions.checkArgument(issueAt > 0);

      long id;
      try {
        id = Long.parseLong(userId);
      } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Invalid user id.");
      }
      User user = UserManager.getUser(id);
      if (user == null) {
        throw new IllegalArgumentException("Invalid user id.");
      }

      return user.getLastBigChangeTime() > issueAt;
    }

    @Override
    public long issueNewSessionCookie(HttpServletRequest req, HttpServletResponse resp,
        String userId) {
      User user = UserManager.getUser(Long.parseLong(userId));
      long expiresAt = System.currentTimeMillis() + SessionUtil.SESSION_LIFETIME * 1000L;
      SessionInfo sessionInfo = new SessionInfo(user.getUid(), expiresAt, random.nextLong());
      FilterUtil.setSessionCookie(req, resp, sessionInfo);
      FilterUtil.setSessionInfoInRequestAttributeAfterLogin(req, user, sessionInfo);
      return SessionUtil.SESSION_LIFETIME;
    }

    @Override
    public void clearSessionCookie(HttpServletRequest req, HttpServletResponse resp) {
      FilterUtil.clearSessionCookie(req, resp);
    }
  }

  private static class MyLaunchHook implements LaunchHook {

    @Override
    public boolean isEnabledForUserAgent(String userAgent) {
      // Enabled for Chrome & FireFox browser
      return userAgent.indexOf("Chrome") != -1 || userAgent.indexOf("Firefox") != -1;
    }

    @Override
    public boolean isEnabledForUser(String userId) {
      return true;
    }
  }
}
