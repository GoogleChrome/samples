package com.google.account.internal.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.account.filter.FilterUtil;
import com.google.account.filter.SessionInfo;
import com.google.config.UrlConfig;

public class LogoutServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    SessionInfo sessionInfo = FilterUtil.getSessionInfo(req);
    if (sessionInfo != null) {
      FilterUtil.clearSessionInfoInAttributeAfterLogout(req);
    }
    FilterUtil.clearSessionCookie(req, resp);
    resp.sendRedirect(UrlConfig.LOGIN_PAGE);
  }
}
