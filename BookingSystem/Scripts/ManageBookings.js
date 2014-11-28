//http://stackoverflow.com/questions/11771531/jquery-and-html5-drag-and-drop-into-table-scheduler
//http://www.jeasyui.com/tutorial/dd/dnd3.php

if (console.clear) {
    console.clear();
};

var unscheduledTbody = null,
    scheduledTbody = null,
    isDroppable = true;

/// Work around for Chrome and Safari (maybe Opera, not 100% sure). Apparently WebKit (or was it the Chromium dev team) decided it was a good idea to avoid initializing the dataTransfer.getData object on the dragend event (also on dragstart it appears). Thus I have to use a global variable to get around it. Good job guys, that's two things you've failed on on an already difficult to implement API that's been around for years...
var dataTransferValue = null;

var Indecies = function (td) {
    var tr = td.parent(),
        tbody = tr.parent();

    var row = tbody.children().index(tr),
        column = tr.children().index(td);

    return [row, column];
};

var CheckCellRowspan = function (options) {
    var element = null;

    for (var i = 1; i < options.rows; i++) {
        element = scheduledTbody.find("tr:eq(" + (options.row + i) + ") td." + options.column);

        if (element.attr("id") != null) {
            isDroppable = false;

            return;
        };
    };

    element = null;

    isDroppable = true;
};

var ToggleCellVisibility = function (options) {
    var selectors = "",
        i = 1;

    for (i; i < options.rows; i++) {
        if (options.hide) {
            selectors = (selectors + ("tr:eq(" + (options.row + i) + ") td." + options.column + ","));
        } else {
            selectors = (selectors + ("tr:eq(" + (options.row + i) + ") td." + options.column + ":hidden,"));
        };
    };

    selectors = selectors.substring(0, (selectors.length - 1));

    if (selectors.length > 0) {
        scheduledTbody.find(selectors).css({
            display: (options.hide ? "none" : "table-cell")
        });
    };
};

var UpdateSchedule = function () {
};

$(function () {
    /// Add draggable="true" to all potential cells
    $("#Unscheduled tbody td,#Scheduled tbody td").prop("draggable", true);

    unscheduledTbody = $("#Unscheduled tbody");
    scheduledTbody = $("#Scheduled tbody");
    /// Add data-scheduled="false" to all unscheduled cells
    unscheduledTbody.find("td").data("scheduled", false);

    /// Find all cells in the Scheduled table
    var scheduledTds = scheduledTbody.find("td");

    $("[draggable]").on("dragstart", function (e) {
        /// Fired on an element when a drag is started. The user is requesting to drag the element
        /// the dragstart event is fired at. During this event, a listener would set information
        /// such the drag data and image to be associated with the drag.

        e.originalEvent.dataTransfer.effectAllowed = "move";
        e.originalEvent.dataTransfer.setData("text/plain", this.id);
    }).on("drag", function (e) {
        /// This event is fired at the source of the drag, that is, the element where dragstart
        /// was fired, during the drag operation.
    }).on("dragend", function (e) {
        /// The source of the drag will receive a dragend event when the drag operation is complete,
        /// whether it was successful or not.
        var dropEffect = e.originalEvent.dataTransfer.dropEffect;

        switch (dropEffect) {
            case "copy":
                /// Falling through to "move" because Chrome on Windows has a bug that makes it
                /// always send "copy" as the dropEffect regardless of what it really is.
                /// The bug has been around since 2010, I think. From what I understand the Chromium
                /// dev team is aprehensive in fixing it because it would require too many changes.
                /// That may be so, but every other browser seems to able to perform the operation
                /// as expected, so that's really not an excuse, especially for two+ years...
            case "move":
                /// Rebuild the cells in the COLUMN at the source location
                if (isDroppable) {
                    var source = $(this),
                        target = $("#" + dataTransferValue);

                    if (source.data("scheduled")) {
                        /// Source cell is in the Scheduled table
                        var sourceIndecies = Indecies(source),
                            sourceRow = sourceIndecies[0],
                            sourceColumn = sourceIndecies[1],
                            rows = target.data("rows");

                        ToggleCellVisibility({
                            rows: rows,
                            row: sourceRow,
                            column: sourceColumn,
                            hide: false
                        });

                        /// Clean up
                        sourceIndecies = null;
                        sourceRow = null;
                        sourceColumn = null;
                        rows = null;
                    } else {
                        /// Source cell is in the Unscheduled table
                        source.parent().remove();
                    };

                    /// Clean up
                    dataTransferValue = null;
                    source = null;
                    target = null;
                };

                break;
            case "link":
            case "none":
            default:
                break;
        };
    });

    /// Add class with the value of the cell's column index
    /// Add data-scheduled="true" to all scheduled cells
    scheduledTds.each(function () {
        var td = $(this);

        td.addClass("" + Indecies(td)[1]);
    }).data("scheduled", true).on("dragenter", function (e) {
        /// Fired when the mouse is first moved over an element while a drag is occuring.
        /// A listener for this event should indicate whether a drop is allowed over this location.
        /// If there are no listeners, or the listeners perform no operations, then a drop is not
        /// allowed by default. This is also the event to listen to if you want to provide feedback
        /// that a drop is allowed such as displaying a highlight or insertion marker.
        ///
        /// DragEnter is called when the mouse enters your control while dragging something.

        e.originalEvent.dataTransfer.dropEffect = "move";

        $(this).addClass("Droppable");
    }).on("dragover", function (e) {
        /// This event is fired as the mouse is moved over an element when a drag is occuring.
        /// Much of the time, the operation that occurs during a listener will be the same as
        /// the dragenter event.
        ///
        /// DragOver is called while the mouse is still in that rectangle and still dragging.

        e.preventDefault();
    }).on("dragleave", function (e) {
        /// This event is fired when the mouse leaves an element while a drag is occuring.
        /// Listeners should remove any highlighting or insertion markers used for drop feedback.

        $(this).removeClass("Droppable");
    }).on("drop", function (e) {
        /// The drop event is fired on the element where the drop was occured at the end of the
        /// drag operation. A listener would be responsible for retrieving the data being dragged and
        /// inserting it at the drop location. This event will only fire if a drop is desired.
        /// It will not fire if the user cancelled the drag operation, for example by pressing
        /// the Escape key, or if the mouse button was released while the mouse was not over a
        /// valid drop target.

        e.preventDefault();

        dataTransferValue = e.originalEvent.dataTransfer.getData("text/plain");

        var source = $("#" + dataTransferValue),
            target = $(this),
            targetIndecies = Indecies(target),
            targetRow = targetIndecies[0],
            targetColumn = targetIndecies[1],
            rows = source.data("rows");

        CheckCellRowspan({
            rows: rows,
            row: targetRow,
            column: targetColumn
        });

        if (isDroppable) {
            var sourceIndecies = Indecies(source),
                sourceRow = sourceIndecies[0],
                sourceColumn = sourceIndecies[1],
                url = source.data("url");

            target.removeClass("Droppable")
                .html(source.html())
                .attr("id", source.attr("id"))
                .attr("rowspan", rows)
                .data("rows", rows)
                .data("url", url);

            source.html("")
                .removeAttr("id")
                .removeAttr("rowspan")
                .removeData("rows")
                .removeData("url");

            /// Hide any visible cells that are affected by the target cell's rowspan
            ToggleCellVisibility({
                rows: rows,
                row: targetRow,
                column: targetColumn,
                hide: true
            });

            /// Clean up
            sourceIndecies = null;
            sourceRow = null;
            sourceColumn = null;
        } else {
            $("b").text("The cell could not be dropped at the target location. It conflicted with an existing cell in its path.");

            target.removeClass("Droppable");
        };

        /// Clean up
        source = null;
        target = null;
        targetIndecies = null;
        targetRow = null;
        targetColumn = null;
        rows = null;
    }).find("a").on("click", function (e) {
        e.preventDefault();

        var source = $(this).closest("td"),
            sourceIndecies = Indecies(source),
            sourceRow = sourceIndecies[0],
            sourceColumn = sourceIndecies[1],
            rows = source.data("rows");

        /// Add a new cell to the Unscheduled table
        unscheduledTbody
            .append($("<tr />")
                .append($("<td draggable=\"true\" data-scheduled=\"false\" />")
                    .html(source.html())
                    .attr("id", source.attr("id"))
                    .data("rows", rows)));

        /// Blank-out the source cell
        source.html("")
            .removeAttr("id")
            .removeAttr("rowspan")
            .removeData("rows");

        /// Unhide any hidden cells that are affected by the source cell's rowspan
        ToggleCellVisibility({
            rows: rows,
            row: sourceRow,
            column: sourceColumn,
            hide: false
        });

        /// Clean up
        source = null;
        sourceIndecies = null;
        sourceRow = null;
        sourceColumn = null;
        rows = null;
    });

    /// Clean up
    scheduledTds = null;
});