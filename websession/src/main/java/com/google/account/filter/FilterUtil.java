package com.google.account.filter;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.account.User;

public class FilterUtil {
  private static final String REQUEST_USER = "user";
  private static final String REQUEST_SESSION_INFO = "session_info";

  public static User getSessionUser(ServletRequest request) {
    return (User) request.getAttribute(REQUEST_USER);
  }

  public static SessionInfo getSessionInfo(ServletRequest request) {
    return (SessionInfo) request.getAttribute(REQUEST_SESSION_INFO);
  }

  public static boolean hasSessionUser(HttpServletRequest request) {
    return getSessionUser(request) != null;
  }

  public static void setSessionCookie(
      HttpServletRequest request,
      HttpServletResponse response,
      SessionInfo session) {
    SessionUtil.setSessionCookie(response, request.getServerName(), session);
  }

  public static void clearSessionCookie(
      HttpServletRequest request, HttpServletResponse response) {
    SessionUtil.clearSessionCookie(response, request.getServerName());
  }

  public static void refreshSessionCookie(
      HttpServletRequest request, HttpServletResponse response) {
    SessionUtil.refreshSessionCookie(
        request, response, request.getServerName());
  }

  public static void setSessionInfoInRequestAttributeAfterLogin(
      ServletRequest request, User user, SessionInfo sessionInfo) {
    request.setAttribute(REQUEST_USER, user);
    request.setAttribute(REQUEST_SESSION_INFO, sessionInfo);
  }

  public static void clearSessionInfoInAttributeAfterLogout(ServletRequest request) {
    request.removeAttribute(REQUEST_USER);
    request.removeAttribute(REQUEST_SESSION_INFO);
  }
}
