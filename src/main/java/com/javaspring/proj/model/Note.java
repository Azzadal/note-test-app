package com.javaspring.proj.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "notes")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String heading;
    private String text;
    private Date dateOfCreation;
    private Date dateOfNotification;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User userId;

    public Note() {
    }

    public Note(String heading, String text, Date dateOfCreation, Date dateOfNotification, User userId) {
        this.heading = heading;
        this.text = text;
        this.dateOfCreation = dateOfCreation;
        this.dateOfNotification = dateOfNotification;
        this.userId = userId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getHeading() {
        return heading;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getDateOfCreation() {
        return dateOfCreation;
    }

    public void setDateOfCreation(Date dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
    }

    public Date getDateOfNotification() {
        return dateOfNotification;
    }

    public void setDateOfNotification(Date dateOfNotification) {
        this.dateOfNotification = dateOfNotification;
    }

    public User getUsr() {
        return userId;
    }

    public void setUsr(User userId) {
        this.userId = userId;
    }
}
