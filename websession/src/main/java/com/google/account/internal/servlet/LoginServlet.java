package com.google.account.internal.servlet;

import java.io.IOException;
import java.util.Random;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.account.filter.FilterUtil;
import com.google.account.filter.SessionInfo;
import com.google.account.filter.SessionUtil;
import com.google.account.internal.UserImpl;
import com.google.account.internal.storage.UserStore;
import com.google.config.UrlConfig;
import com.google.dosidos.AppContextListener;
import com.google.dosidos.TwoTokenManager;
import com.google.dosidos.data.SessionState;

public class LoginServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;
  private static Random random = new Random();

  private TwoTokenManager getTwoTokenManager() {
    return (TwoTokenManager) getServletContext().getAttribute(
        AppContextListener.ATTR_TWO_TOKEN_MANAGER);
  }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    doPost(req, resp);
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    String email = req.getParameter("email");
    String password = req.getParameter("password");

    if (UserStore.login(email, password)) {
      UserImpl user = UserStore.getUserByEmail(email);
      long expiresAt = System.currentTimeMillis() + SessionUtil.SESSION_LIFETIME * 1000;
      SessionInfo sessionInfo = new SessionInfo(user.getUid(), expiresAt, random.nextLong());
      FilterUtil.setSessionCookie(req, resp, sessionInfo);
      FilterUtil.setSessionInfoInRequestAttributeAfterLogin(req, user, sessionInfo);
      
      String uid = String.valueOf(user.getUid());
      TwoTokenManager twoTokenManager = getTwoTokenManager();
      if (twoTokenManager.isEnabled(req.getHeader("User-Agent"), uid)) {
        SessionState sessionState = twoTokenManager.generateSessionStateOnLogin(
            uid, req.getServerName(), SessionUtil.SESSION_LIFETIME);
        // This will trigger the JSP page to install service worker
        req.setAttribute("login_session_state", sessionState);
      }

      req.getRequestDispatcher(UrlConfig.HOME_PAGE).forward(req, resp);
    } else {
      req.setAttribute("error", "WRONG_PASSWORD");
      RequestDispatcher dispatcher = getServletContext().getRequestDispatcher(
          UrlConfig.LOGIN_PAGE);
      dispatcher.forward(req, resp);
    }
  }
}
