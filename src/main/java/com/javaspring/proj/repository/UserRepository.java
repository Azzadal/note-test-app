package com.javaspring.proj.repository;

import com.javaspring.proj.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
    User findByName(String username);


}
