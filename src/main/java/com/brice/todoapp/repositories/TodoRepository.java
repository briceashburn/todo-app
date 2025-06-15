package com.brice.todoapp.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.brice.todoapp.models.Todo;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserIdOrderByPositionOrderAsc(Long userId);
    
    List<Todo> findByUserIdAndStatusOrderByPositionOrderAsc(Long userId, String status);
    
    @Query("SELECT t FROM Todo t WHERE t.user.username = :username ORDER BY t.positionOrder ASC")
    List<Todo> findByUsernameOrderByPositionOrderAsc(@Param("username") String username);
    
    @Query("SELECT t FROM Todo t WHERE t.user.username = :username AND t.status = :status ORDER BY t.positionOrder ASC")
    List<Todo> findByUsernameAndStatusOrderByPositionOrderAsc(@Param("username") String username, @Param("status") String status);
}
