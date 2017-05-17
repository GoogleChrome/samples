package com.google.account.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.config.UrlConfig;

public class NoSessionFilter implements Filter {

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    if (FilterUtil.hasSessionUser((HttpServletRequest) request)) {
      ((HttpServletResponse) response).sendRedirect(UrlConfig.HOME_PAGE);
    } else {
      chain.doFilter(request, response);
    }
  }

  @Override
  public void destroy() {
  }

  @Override
  public void init(FilterConfig config) throws ServletException {
  }
}
