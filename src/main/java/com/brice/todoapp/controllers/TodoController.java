package com.brice.todoapp.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brice.todoapp.dto.TodoRequest;
import com.brice.todoapp.dto.TodoResponse;
import com.brice.todoapp.models.Todo;
import com.brice.todoapp.models.User;
import com.brice.todoapp.repositories.TodoRepository;
import com.brice.todoapp.repositories.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/todos")
@Validated
public class TodoController {

    private static final Logger LOG = LoggerFactory.getLogger(TodoController.class);
    private static final String STATUS_KEY = "status";
    private static final String MESSAGE_KEY = "message";
    private static final String CODE_KEY = "code";
    private static final String STATUS_ERROR = "error";
    private static final String STATUS_SUCCESS = "success";

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public TodoController(TodoRepository todoRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTodo(@Valid @RequestBody TodoRequest request) {
        LOG.info("Creating todo for user: {}, title: {}", getCurrentUsername(), request.getTitle());
        try {
            String username = getCurrentUsername();
            Optional<User> userOpt = userRepository.findByUsername(username);

            if (userOpt.isEmpty()) {
                LOG.warn("User not found during todo creation: {}", username);
                return createErrorResponse("User not found", 404);
            }

            Todo todo = new Todo();
            todo.setTitle(request.getTitle());
            todo.setStatus(request.getStatus());
            todo.setPositionOrder(request.getPositionOrder());
            todo.setUser(userOpt.get());

            Todo savedTodo = todoRepository.save(todo);
            TodoResponse response = convertToResponse(savedTodo);

            LOG.info("Todo created successfully for user {}: id={}, title={}", username, savedTodo.getId(), savedTodo.getTitle());
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put(STATUS_KEY, STATUS_SUCCESS);
            successResponse.put(MESSAGE_KEY, "Todo created successfully");
            successResponse.put("todo", response);
            successResponse.put(CODE_KEY, 201);
            return ResponseEntity.status(201).body(successResponse);

        } catch (Exception e) {
            LOG.error("Error creating todo", e);
            return createErrorResponse("Failed to create todo", 500);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTodos() {
        LOG.info("Fetching todos for user: {}", getCurrentUsername());
        try {
            String username = getCurrentUsername();
            List<Todo> todos = todoRepository.findByUsernameOrderByPositionOrderAsc(username);
            List<TodoResponse> todoResponses = todos.stream()
                    .map(this::convertToResponse)
                    .toList();

            LOG.info("Retrieved {} todos for user: {}", todos.size(), username);

            Map<String, Object> response = new HashMap<>();
            response.put(STATUS_KEY, STATUS_SUCCESS);
            response.put("todos", todoResponses);
            response.put(CODE_KEY, 200);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            LOG.error("Error fetching todos for user: {}", getCurrentUsername(), e);
            return createErrorResponse("Failed to fetch todos", 500);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTodo(@PathVariable Long id, @Valid @RequestBody TodoRequest request) {
        LOG.info("Updating todo {} for user: {}", id, getCurrentUsername());
        try {
            String username = getCurrentUsername();
            Optional<Todo> todoOpt = todoRepository.findById(id);

            if (todoOpt.isEmpty()) {
                LOG.warn("Todo not found for update: id={}, user={}", id, username);
                return createErrorResponse("Todo not found", 404);
            }

            Todo todo = todoOpt.get();
            if (!todo.getUser().getUsername().equals(username)) {
                LOG.warn("Unauthorized access attempt to update todo: id={}, user={}, owner={}", 
                         id, username, todo.getUser().getUsername());
                return createErrorResponse("Unauthorized access", 403);
            }

            todo.setTitle(request.getTitle());
            todo.setStatus(request.getStatus());
            todo.setPositionOrder(request.getPositionOrder());
            todo.setUpdatedAt(LocalDateTime.now());

            Todo updatedTodo = todoRepository.save(todo);
            TodoResponse response = convertToResponse(updatedTodo);

            LOG.info("Todo updated successfully for user {}: id={}, title={}", username, id, updatedTodo.getTitle());
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put(STATUS_KEY, STATUS_SUCCESS);
            successResponse.put(MESSAGE_KEY, "Todo updated successfully");
            successResponse.put("todo", response);
            successResponse.put(CODE_KEY, 200);
            return ResponseEntity.ok(successResponse);

        } catch (Exception e) {
            LOG.error("Error updating todo: id={}, user={}", id, getCurrentUsername(), e);
            return createErrorResponse("Failed to update todo", 500);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTodo(@PathVariable Long id) {
        LOG.info("Deleting todo {} for user: {}", id, getCurrentUsername());
        try {
            String username = getCurrentUsername();
            Optional<Todo> todoOpt = todoRepository.findById(id);

            if (todoOpt.isEmpty()) {
                LOG.warn("Todo not found for deletion: id={}, user={}", id, username);
                return createErrorResponse("Todo not found", 404);
            }

            Todo todo = todoOpt.get();
            if (!todo.getUser().getUsername().equals(username)) {
                LOG.warn("Unauthorized access attempt to delete todo: id={}, user={}, owner={}", 
                         id, username, todo.getUser().getUsername());
                return createErrorResponse("Unauthorized access", 403);
            }

            todoRepository.delete(todo);

            LOG.info("Todo deleted successfully for user {}: id={}, title={}", username, id, todo.getTitle());
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put(STATUS_KEY, STATUS_SUCCESS);
            successResponse.put(MESSAGE_KEY, "Todo deleted successfully");
            successResponse.put(CODE_KEY, 200);
            return ResponseEntity.ok(successResponse);

        } catch (Exception e) {
            LOG.error("Error deleting todo: id={}, user={}", id, getCurrentUsername(), e);
            return createErrorResponse("Failed to delete todo", 500);
        }
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    private TodoResponse convertToResponse(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getStatus(),
                todo.getCreatedAt(),
                todo.getUpdatedAt(),
                todo.getPositionOrder()
        );
    }

    private ResponseEntity<Map<String, Object>> createErrorResponse(String message, int code) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put(STATUS_KEY, STATUS_ERROR);
        errorResponse.put(MESSAGE_KEY, message);
        errorResponse.put(CODE_KEY, code);
        return ResponseEntity.status(code).body(errorResponse);
    }
}
