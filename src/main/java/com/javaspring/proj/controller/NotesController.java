package com.javaspring.proj.controller;

import com.javaspring.proj.model.Note;
import com.javaspring.proj.model.User;
import com.javaspring.proj.repository.NotesRepository;
import com.javaspring.proj.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class NotesController {
    private final NotesRepository notesRepository;
    private final UserRepository userRepository;

    public NotesController(NotesRepository notesRepository, UserRepository userRepository) {
        this.notesRepository = notesRepository;
        this.userRepository = userRepository;
    }


    @GetMapping(value = "/notes/{username}")
    public List<Note> getNotes(@PathVariable ("username") String name){
        User user = userRepository.findByName(name);
        return user.getNoteList();
    }

    @PostMapping(value = "/addNote")
    public void addNote(@RequestBody Object obj) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Map<String, String> lhm = (LinkedHashMap<String, String>) obj;
        String heading = lhm.get("heading");
        String text = lhm.get("text");
        Date dateOfCreation = format.parse(lhm.get("dateOfCreation"));
        Date dateOfNotification = format.parse(lhm.get("dateOfNotification"));
        User user = userRepository.findByName(lhm.get("userId"));

        Note note = new Note(heading, text, dateOfCreation, dateOfNotification, user);

        notesRepository.save(note);
    }

    @PutMapping("edit_note/{heading}")
    public void update(@PathVariable ("heading") String heading, @RequestBody Note note){
        Note noteDb = notesRepository.findByHeading(heading);
        BeanUtils.copyProperties(note, noteDb, "id", "usr");
        notesRepository.save(noteDb);
    }

    @DeleteMapping(value = "/delete_note/{id}")
    public void deleteNote(@PathVariable ("id") Integer id){
        notesRepository.deleteNote(id);
    }
}
