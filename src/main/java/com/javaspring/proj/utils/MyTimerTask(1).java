package com.javaspring.proj.utils;

import org.springframework.messaging.core.MessageSendingOperations;

import java.util.Date;
import java.util.Map;
import java.util.TimerTask;

public class MyTimerTask extends TimerTask {

    private final MessageSendingOperations<String> messagingTemplate;

    private Map obj;
    private String destination = "/topic/test";


    public MyTimerTask(MessageSendingOperations<String> messagingTemplate, Map obj) {
        this.messagingTemplate = messagingTemplate;
        this.obj = obj;
    }

    @Override
    public void run() {
        System.out.println("TimerTask начал свое выполнение в:" + new Date());
        completeTask();
        System.out.println("TimerTask закончил свое выполнение в:" + new Date());
    }

    private void completeTask() {
        this.messagingTemplate.convertAndSend(destination, obj);
    }
}
