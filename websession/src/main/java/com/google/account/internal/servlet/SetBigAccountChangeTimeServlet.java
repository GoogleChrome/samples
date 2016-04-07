package com.google.account.internal.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.account.User;
import com.google.account.UserManager;
import com.google.account.filter.FilterUtil;
import com.google.config.UrlConfig;

public class SetBigAccountChangeTimeServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    User user = FilterUtil.getSessionUser(req);
    UserManager.setBigAccountChangeTime(user);
    resp.sendRedirect(UrlConfig.HOME_PAGE);
  }
}
