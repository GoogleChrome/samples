package com.google.account;

import com.google.account.internal.storage.UserStore;

public class UserManager {

  public static User getUser(String email) {
    return UserStore.getUserByEmail(email);
  }

  public static User getUser(long userId) {
    return UserStore.getUserById(userId);
  }

  public static void setBigAccountChangeTime(User user) {
    UserStore.setBigAccountChangeTime(user.getUid());
  }
}
