/* =========================================================
   RASHIFAL TABS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const tabs = document.querySelectorAll("[data-rashifal-tab]");
    const panels = document.querySelectorAll(".rashifal-panel");

    // Stop if Rashifal tabs are not present
    if (!tabs.length || !panels.length) {
        return;
    }


    function activateRashifalTab(tab) {

        const targetId = tab.getAttribute("data-rashifal-tab");
        const targetPanel = document.getElementById(targetId);

        if (!targetPanel) {
            return;
        }


        /* -------------------------------------------------
           Update Tabs
           ------------------------------------------------- */

        tabs.forEach(function (currentTab) {

            const isActive = currentTab === tab;

            currentTab.classList.toggle("active", isActive);

            currentTab.setAttribute(
                "aria-selected",
                isActive ? "true" : "false"
            );

        });


        /* -------------------------------------------------
           Update Panels
           ------------------------------------------------- */

        panels.forEach(function (panel) {

            const isActive = panel === targetPanel;

            panel.hidden = !isActive;

            panel.classList.toggle("active", isActive);

        });

    }


    /* -----------------------------------------------------
       TAB CLICK
       ----------------------------------------------------- */

    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            activateRashifalTab(tab);

        });

    });


    /* -----------------------------------------------------
       KEYBOARD NAVIGATION
       ----------------------------------------------------- */

    tabs.forEach(function (tab, index) {

        tab.addEventListener("keydown", function (event) {

            let newIndex = index;


            // Arrow Right
            if (event.key === "ArrowRight") {

                newIndex = (index + 1) % tabs.length;

            }


            // Arrow Left
            else if (event.key === "ArrowLeft") {

                newIndex =
                    (index - 1 + tabs.length) % tabs.length;

            }


            // Home
            else if (event.key === "Home") {

                newIndex = 0;

            }


            // End
            else if (event.key === "End") {

                newIndex = tabs.length - 1;

            }


            else {
                return;
            }


            event.preventDefault();

            tabs[newIndex].focus();

            activateRashifalTab(tabs[newIndex]);

        });

    });


});