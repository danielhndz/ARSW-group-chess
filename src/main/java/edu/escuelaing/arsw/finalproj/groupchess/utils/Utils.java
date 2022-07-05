package edu.escuelaing.arsw.finalproj.groupchess.utils;

import org.springframework.web.servlet.ModelAndView;

public class Utils {

    private Utils() {
    }

    public static ModelAndView getModelAndView(String viewName) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName(viewName);
        return modelAndView;
    }
}
