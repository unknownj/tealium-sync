var utuiConversion = {
  aButton: function(icon,label,action){
    var output = [
      "<div class='tab-menu-item'>",
      "<span id='whatever' class='btn btn-info' style='margin-top: 0' onclick='window.customHandlers[" + this.registerHandler(action) + "]();'>",
      icon ? "<i class='" + icon + "'></i> " : "",
      label,
      "</span>",
      "</div>"
    ];
    return output.join("");
  },

  aLink: function(icon,label,action){
    return [
      "<li>",
      "<a href='#' onclick='window.customHandlers[" + this.registerHandler(action) + "]();'>" + label + "</a>",
      "</li>"
    ].join("");
  },

  addAction: function(location,icon,label,action){
    var locationMapping = {
      extensions: {
        selector: "#customizeContainer_headerControls",
        interface: "aButton"
      },
      tags: {
        selector: "#manageContainer_headerControls",
        interface: "aButton"
      },
      loadrules: {
        selector: "#loadrulesContainer_headerControls",
        interface: "aButton"
      },
      udo: {
        selector: "#defineContainer_headerControls",
        interface: "aButton"
      },
      myiq: {
        selector: "#my_site_context ul",
        interface: "aLink"
      },
    }

    if(!locationMapping[location]) return;

    var s = locationMapping[location].selector;
    var i = locationMapping[location].interface;

    $(s).append($(this[i](icon,label,action)));
  },

  registerHandler: function(cb){
    window.customHandlers = window.customHandlers || [];
    return window.customHandlers.push(cb) - 1
  },

  addJSExtension = function(extId){
    if(!exapi || !utui || !dsapi) return console.error("Utag objects not found");
    
    exapi.addExtension(extId, "100036");
  
    utui.data.customizations[extId].title = "JS Extension " + extId;
    utui.data.customizations[extId].code = "// Newly created (" + (new Date).toISOString().split("T").join(" ").split(".")[0] + ")";

    if(typeof cb === "function") cb(extId);

    utui.customizations.addItem(extId);
    utui.customizations.drawJUIAccordion(extId);
    utui.labels.helper.renderLabels(extId, utui.customizations.id);
    if (exapi.hasOutput(extId)) dsapi.getAllDataSourceSelection();
  },

  createJSExtension: function(cb) {

    if(!exapi || !utui || !dsapi) return console.error("Utag objects not found");
  
    var addJSE = this.addJSExtension;

    exapi.getNextIdFromServer(
      1,
      null,
      function (providedLastId, count, extId) {
        addJSE(extId);
      },
      function (extId) {
        addJSE(extId);
      }
    );
  
  },

  createJSExtensionWithCode = function(code){
    this.createJSExtension(function(id){
      utui.data.customizations[id].code = code
    });
  },


  getPrivacyManagerExtensionID: function(){
    for(var i = 0; i < utui.data.customizations.length; i++){
      if(utui.data.customizations[i].some_type_id = "the pm type") return i;
    }
    return null;
  },

  getPrivacyManagerCategories: function(){
    var pmid = this.getPrivacyManagerExtensionID();
    if(!pmid) return null;
    return JSON.parse(utui.data.customizations[pmid].categories);
  },

  getPrivacyManagerCategoryForTag: function(tag_id){
    var pmobject = this.getPrivacyManagerCategories();
    if(!pmobject) return null;
    var pmmap = {};
    for(var cat in pmobject){
      for(var i = 0; i < pmobject[cat].tags.length; i++){
        pmmap[pmobject[cat].tags[i].tag_name] = cat;
        if(pmobject[cat].tags[i].id) pmmap[pmobject[cat].tags[i].id] = cat;
      }
    }
    return pmmap[tag_id] || pmmap[utui.data.manage[tag_id].title];
  },

  getJSExtensions: function(){
    var output = {}
    for(var extId in utui.data.customizations){
      var ext = Object.assign({},utui.data.customizations[extId]);
      if(ext.id !== "100036") continue;

      var jsExt = {
        id: ext._id,
        code: ext.code,
        title: ext.title,
      };

      output[ext._id] = jsExt;
    
      var s = ext.settings || utui.data.settings;
      jsExt.account = s.account;
      jsExt.profile = s.profileid;
      jsExt.updated = s.revision;
      jsExt.creation = s.creation;
      if(s.origin_id) jsExt.id = s.origin_id;
      jsExt.path = [jsExt.account,jsExt.profile,jsExt.id].join("/");
    }
    return output;
  }

  encodeJSExtension: function(extension){
    return "title=" + encodeURIComponent(extension.title) + "&path=" + encodeURIComponent(extension.path) + "&code=" + btoa(extension.code);
  }
}
