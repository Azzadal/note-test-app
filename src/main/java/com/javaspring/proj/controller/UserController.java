package com.javaspring.proj.controller;

import com.javaspring.proj.utils.MyTimerTask;
import com.javaspring.proj.model.Note;
import com.javaspring.proj.model.User;
import com.javaspring.proj.repository.UserRepository;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserRepository userRepository;
    private final MessageSendingOperations<String> messagingTemplate;

    private Map<String, String> not = new HashMap<>();
    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
    DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");

    public UserController(UserRepository userRepository, MessageSendingOperations<String> messagingTemplate) {
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping(value = "/login")
    public Integer login(@RequestBody User user){
        User userFromDb = userRepository.findByName(user.getName());
        List<Note> noteList = userFromDb.getNoteList();

        int i = 0;
        for (Note note: noteList){
            if (dateFormat.format(note.getDateOfNotification()).compareTo(dateFormat.format(new Date())) != -1){
                not.put("message", "Сработало оповещение у " + note.getHeading());
                new Timer("timer " + i, true).schedule(new MyTimerTask(messagingTemplate, not), note.getDateOfNotification());
            }
        }
        return userFromDb.getId();
    }
}
