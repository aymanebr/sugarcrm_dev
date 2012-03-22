/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('datatable-base',function(Y){var YLang=Y.Lang,YisValue=YLang.isValue,Ysubstitute=Y.Lang.substitute,YNode=Y.Node,Ycreate=YNode.create,YgetClassName=Y.ClassNameManager.getClassName,DATATABLE="datatable",COLUMN="column",FOCUS="focus",KEYDOWN="keydown",MOUSEENTER="mouseenter",MOUSELEAVE="mouseleave",MOUSEUP="mouseup",MOUSEDOWN="mousedown",CLICK="click",DBLCLICK="dblclick",CLASS_COLUMNS=YgetClassName(DATATABLE,"columns"),CLASS_DATA=YgetClassName(DATATABLE,"data"),CLASS_MSG=YgetClassName(DATATABLE,"msg"),CLASS_LINER=YgetClassName(DATATABLE,"liner"),CLASS_FIRST=YgetClassName(DATATABLE,"first"),CLASS_LAST=YgetClassName(DATATABLE,"last"),CLASS_EVEN=YgetClassName(DATATABLE,"even"),CLASS_ODD=YgetClassName(DATATABLE,"odd"),TEMPLATE_TABLE='<table></table>',TEMPLATE_COL='<col></col>',TEMPLATE_THEAD='<thead class="'+CLASS_COLUMNS+'"></thead>',TEMPLATE_TBODY='<tbody class="'+CLASS_DATA+'"></tbody>',TEMPLATE_TH='<th id="{id}" rowspan="{rowspan}" colspan="{colspan}" class="{classnames}" abbr="{abbr}"><div class="'+CLASS_LINER+'">{value}</div></th>',TEMPLATE_TR='<tr id="{id}"></tr>',TEMPLATE_TD='<td headers="{headers}" class="{classnames}"><div class="'+CLASS_LINER+'">{value}</div></td>',TEMPLATE_VALUE='{value}',TEMPLATE_MSG='<tbody class="'+CLASS_MSG+'"></tbody>';function Column(config){Column.superclass.constructor.apply(this,arguments);}
Y.mix(Column,{NAME:"column",ATTRS:{id:{valueFn:"_defaultId",readOnly:true},key:{valueFn:"_defaultKey"},field:{valueFn:"_defaultField"},label:{valueFn:"_defaultLabel"},children:{value:null},abbr:{value:""},classnames:{readOnly:true,getter:"_getClassnames"},formatter:{},sortable:{value:false},editor:{},width:{},resizeable:{},minimized:{},minWidth:{},maxAutoWidth:{}}});Y.extend(Column,Y.Widget,{_defaultId:function(){return Y.guid();},_defaultKey:function(key){return key||Y.guid();},_defaultField:function(field){return field||this.get("key");},_defaultLabel:function(label){return label||this.get("key");},_afterAbbrChange:function(e){this._uiSetAbbr(e.newVal);},keyIndex:null,headers:null,colSpan:1,rowSpan:1,parent:null,thNode:null,initializer:function(config){},destructor:function(){},_getClassnames:function(){return Y.ClassNameManager.getClassName(COLUMN,this.get("id"));},syncUI:function(){this._uiSetAbbr(this.get("abbr"));},_uiSetAbbr:function(val){this.thNode.set("abbr",val);}});Y.Column=Column;function Columnset(config){Columnset.superclass.constructor.apply(this,arguments);}
Y.mix(Columnset,{NAME:"columnset",ATTRS:{definitions:{setter:"_setDefinitions"}}});Y.extend(Columnset,Y.Base,{_setDefinitions:function(definitions){return Y.clone(definitions);},tree:null,idHash:null,keyHash:null,keys:null,initializer:function(){var tree=[],idHash={},keyHash={},keys=[],definitions=this.get("definitions"),self=this;function parseColumns(depth,currentDefinitions,parent){var i=0,len=currentDefinitions.length,currentDefinition,column,currentChildren;depth++;if(!tree[depth]){tree[depth]=[];}
for(;i<len;++i){currentDefinition=currentDefinitions[i];currentDefinition=YLang.isString(currentDefinition)?{key:currentDefinition}:currentDefinition;column=new Y.Column(currentDefinition);currentDefinition.yuiColumnId=column.get("id");idHash[column.get("id")]=column;keyHash[column.get("key")]=column;if(parent){column.parent=parent;}
if(YLang.isArray(currentDefinition.children)){currentChildren=currentDefinition.children;column._set("children",currentChildren);self._setColSpans(column,currentDefinition);self._cascadePropertiesToChildren(column,currentChildren);if(!tree[depth+1]){tree[depth+1]=[];}
parseColumns(depth,currentChildren,column);}
else{column.keyIndex=keys.length;keys.push(column);}
tree[depth].push(column);}
depth--;}
parseColumns(-1,definitions);this.tree=tree;this.idHash=idHash;this.keyHash=keyHash;this.keys=keys;this._setRowSpans();this._setHeaders();},destructor:function(){},_cascadePropertiesToChildren:function(column,currentChildren){var i=0,len=currentChildren.length,child;for(;i<len;++i){child=currentChildren[i];if(column.get("className")&&(child.className===undefined)){child.className=column.get("className");}
if(column.get("editor")&&(child.editor===undefined)){child.editor=column.get("editor");}
if(column.get("formatter")&&(child.formatter===undefined)){child.formatter=column.get("formatter");}
if(column.get("resizeable")&&(child.resizeable===undefined)){child.resizeable=column.get("resizeable");}
if(column.get("sortable")&&(child.sortable===undefined)){child.sortable=column.get("sortable");}
if(column.get("hidden")){child.hidden=true;}
if(column.get("width")&&(child.width===undefined)){child.width=column.get("width");}
if(column.get("minWidth")&&(child.minWidth===undefined)){child.minWidth=column.get("minWidth");}
if(column.get("maxAutoWidth")&&(child.maxAutoWidth===undefined)){child.maxAutoWidth=column.get("maxAutoWidth");}}},_setColSpans:function(column,definition){var terminalChildNodes=0;function countTerminalChildNodes(ancestor){var descendants=ancestor.children,i=0,len=descendants.length;for(;i<len;++i){if(YLang.isArray(descendants[i].children)){countTerminalChildNodes(descendants[i]);}
else{terminalChildNodes++;}}}
countTerminalChildNodes(definition);column.colSpan=terminalChildNodes;},_setRowSpans:function(){function parseDomTreeForRowSpan(tree){var maxRowDepth=1,currentRow,currentColumn,m,p;function countMaxRowDepth(row,tmpRowDepth){tmpRowDepth=tmpRowDepth||1;var i=0,len=row.length,col;for(;i<len;++i){col=row[i];if(YLang.isArray(col.children)){tmpRowDepth++;countMaxRowDepth(col.children,tmpRowDepth);tmpRowDepth--;}
else if(col.get&&YLang.isArray(col.get("children"))){tmpRowDepth++;countMaxRowDepth(col.get("children"),tmpRowDepth);tmpRowDepth--;}
else{if(tmpRowDepth>maxRowDepth){maxRowDepth=tmpRowDepth;}}}}
for(m=0;m<tree.length;m++){currentRow=tree[m];countMaxRowDepth(currentRow);for(p=0;p<currentRow.length;p++){currentColumn=currentRow[p];if(!YLang.isArray(currentColumn.get("children"))){currentColumn.rowSpan=maxRowDepth;}}
maxRowDepth=1;}}
parseDomTreeForRowSpan(this.tree);},_setHeaders:function(){var headers,column,allKeys=this.keys,i=0,len=allKeys.length;function recurseAncestorsForHeaders(headers,column){headers.push(column.get("id"));if(column.parent){recurseAncestorsForHeaders(headers,column.parent);}}
for(;i<len;++i){headers=[];column=allKeys[i];recurseAncestorsForHeaders(headers,column);column.headers=headers.reverse().join(" ");}},getColumn:function(){}});Y.Columnset=Columnset;function DTBase(config){DTBase.superclass.constructor.apply(this,arguments);}
Y.mix(DTBase,{NAME:"dataTable",ATTRS:{columnset:{setter:"_setColumnset"},recordset:{value:new Y.Recordset({records:[]}),setter:"_setRecordset"},summary:{},caption:{},thValueTemplate:{value:TEMPLATE_VALUE},tdValueTemplate:{value:TEMPLATE_VALUE},trTemplate:{value:TEMPLATE_TR}},HTML_PARSER:{}});Y.extend(DTBase,Y.Widget,{thTemplate:TEMPLATE_TH,tdTemplate:TEMPLATE_TD,_theadNode:null,_tbodyNode:null,_msgNode:null,_setColumnset:function(columns){return YLang.isArray(columns)?new Y.Columnset({definitions:columns}):columns;},_afterColumnsetChange:function(e){if(this.get("rendered")){this._uiSetColumnset(e.newVal);}},_setRecordset:function(rs){if(YLang.isArray(rs)){rs=new Y.Recordset({records:rs});}
rs.addTarget(this);return rs;},_afterRecordsetChange:function(e){if(this.get("rendered")){this._uiSetRecordset(e.newVal);}},_afterSummaryChange:function(e){if(this.get("rendered")){this._uiSetSummary(e.newVal);}},_afterCaptionChange:function(e){if(this.get("rendered")){this._uiSetCaption(e.newVal);}},initializer:function(config){this.after("columnsetChange",this._afterColumnsetChange);this.after("recordsetChange",this._afterRecordsetChange);this.after("summaryChange",this._afterSummaryChange);this.after("captionChange",this._afterCaptionChange);},destructor:function(){this.get("recordset").removeTarget(this);},renderUI:function(){return(this._addTableNode(this.get("contentBox"))&&this._addColgroupNode(this._tableNode)&&this._addTheadNode(this._tableNode)&&this._addTbodyNode(this._tableNode)&&this._addMessageNode(this._tableNode)&&this._addCaptionNode(this._tableNode));},_addTableNode:function(containerNode){if(!this._tableNode){this._tableNode=containerNode.appendChild(Ycreate(TEMPLATE_TABLE));}
return this._tableNode;},_addColgroupNode:function(tableNode){var len=this.get("columnset").keys.length,i=0,allCols=["<colgroup>"];for(;i<len;++i){allCols.push(TEMPLATE_COL);}
allCols.push("</colgroup>");this._colgroupNode=tableNode.insertBefore(Ycreate(allCols.join("")),tableNode.get("firstChild"));return this._colgroupNode;},_addTheadNode:function(tableNode){if(tableNode){this._theadNode=tableNode.insertBefore(Ycreate(TEMPLATE_THEAD),this._colgroupNode.next());return this._theadNode;}},_addTbodyNode:function(tableNode){this._tbodyNode=tableNode.appendChild(Ycreate(TEMPLATE_TBODY));return this._tbodyNode;},_addMessageNode:function(tableNode){this._msgNode=tableNode.insertBefore(Ycreate(TEMPLATE_MSG),this._tbodyNode);return this._msgNode;},_addCaptionNode:function(tableNode){this._captionNode=tableNode.createCaption();return this._captionNode;},bindUI:function(){var theadFilter="thead."+CLASS_COLUMNS+">tr>th",tbodyFilter="tbody."+CLASS_DATA+">tr>td",msgFilter="tbody."+CLASS_MSG+">tr>td";},delegate:function(type){if(type==="dblclick"){this.get("boundingBox").delegate.apply(this.get("boundingBox"),arguments);}
else{this.get("contentBox").delegate.apply(this.get("contentBox"),arguments);}},syncUI:function(){this._uiSetColumnset(this.get("columnset"));this._uiSetRecordset(this.get("recordset"));this._uiSetSummary(this.get("summary"));this._uiSetCaption(this.get("caption"));},_uiSetSummary:function(val){val=YisValue(val)?val:"";this._tableNode.set("summary",val);},_uiSetCaption:function(val){val=YisValue(val)?val:"";this._captionNode.setContent(val);},_uiSetColumnset:function(cs){var tree=cs.tree,thead=this._theadNode,i=0,len=tree.length,parent=thead.get("parentNode"),nextSibling=thead.next();thead.remove();thead.get("children").remove(true);for(;i<len;++i){this._addTheadTrNode({thead:thead,columns:tree[i]},(i===0),(i===len-1));}
parent.insert(thead,nextSibling);},_addTheadTrNode:function(o,isFirst,isLast){o.tr=this._createTheadTrNode(o,isFirst,isLast);this._attachTheadTrNode(o);},_createTheadTrNode:function(o,isFirst,isLast){var tr=Ycreate(Ysubstitute(this.get("trTemplate"),o)),i=0,columns=o.columns,len=columns.length,column;if(isFirst){tr.addClass(CLASS_FIRST);}
if(isLast){tr.addClass(CLASS_LAST);}
for(;i<len;++i){column=columns[i];this._addTheadThNode({value:column.get("label"),column:column,tr:tr});}
return tr;},_attachTheadTrNode:function(o){o.thead.appendChild(o.tr);},_addTheadThNode:function(o){o.th=this._createTheadThNode(o);this._attachTheadThNode(o);o.column.thNode=o.th;},_createTheadThNode:function(o){var column=o.column;o.id=column.get("id");o.colspan=column.colSpan;o.rowspan=column.rowSpan;o.abbr=column.get("abbr");o.classnames=column.get("classnames");o.value=Ysubstitute(this.get("thValueTemplate"),o);return Ycreate(Ysubstitute(this.thTemplate,o));},_attachTheadThNode:function(o){o.tr.appendChild(o.th);},_uiSetRecordset:function(rs){var i=0,len=rs.getLength(),oldTbody=this._tbodyNode,parent=oldTbody.get("parentNode"),nextSibling=oldTbody.next(),o={},newTbody;oldTbody.remove();oldTbody=null;newTbody=this._addTbodyNode(this._tableNode);newTbody.remove();this._tbodyNode=newTbody;o.tbody=newTbody;for(;i<len;++i){o.record=rs.getRecord(i);o.rowindex=i;this._addTbodyTrNode(o);}
parent.insert(this._tbodyNode,nextSibling);},_addTbodyTrNode:function(o){var tbody=o.tbody,record=o.record;o.tr=tbody.one("#"+record.get("id"))||this._createTbodyTrNode(o);this._attachTbodyTrNode(o);},_createTbodyTrNode:function(o){var tr=Ycreate(Ysubstitute(this.get("trTemplate"),{id:o.record.get("id")})),i=0,allKeys=this.get("columnset").keys,len=allKeys.length;o.tr=tr;for(;i<len;++i){o.column=allKeys[i];this._addTbodyTdNode(o);}
return tr;},_attachTbodyTrNode:function(o){var tbody=o.tbody,tr=o.tr,index=o.rowindex,nextSibling=tbody.get("children").item(index)||null,isEven=(index%2===0);if(isEven){tr.replaceClass(CLASS_ODD,CLASS_EVEN);}
else{tr.replaceClass(CLASS_EVEN,CLASS_ODD);}
tbody.insertBefore(tr,nextSibling);},_addTbodyTdNode:function(o){o.td=this._createTbodyTdNode(o);this._attachTbodyTdNode(o);},_createTbodyTdNode:function(o){var column=o.column;o.headers=column.headers;o.classnames=column.get("classnames");o.value=this.formatDataCell(o);return Ycreate(Ysubstitute(this.tdTemplate,o));},_attachTbodyTdNode:function(o){o.tr.appendChild(o.td);},formatDataCell:function(o){var record=o.record,column=o.column,formatter=column.get("formatter");o.data=record.get("data");o.value=record.getValue(column.get("field"));return YLang.isString(formatter)?Ysubstitute(formatter,o):YLang.isFunction(formatter)?formatter.call(this,o):Ysubstitute(this.get("tdValueTemplate"),o);}});Y.namespace("DataTable").Base=DTBase;},'3.3.0',{requires:['recordset-base','widget','substitute','event-mouseenter']});YUI.add('datatable-datasource',function(Y){function DataTableDataSource(){DataTableDataSource.superclass.constructor.apply(this,arguments);}
Y.mix(DataTableDataSource,{NS:"datasource",NAME:"dataTableDataSource",ATTRS:{datasource:{setter:"_setDataSource"},initialRequest:{setter:"_setInitialRequest"}}});Y.extend(DataTableDataSource,Y.Plugin.Base,{_setDataSource:function(ds){return ds||new Y.DataSource.Local(ds);},_setInitialRequest:function(request){},initializer:function(config){if(!Y.Lang.isUndefined(config.initialRequest)){this.load({request:config.initialRequest});}},load:function(config){config=config||{};config.request=config.request||this.get("initialRequest");config.callback=config.callback||{success:Y.bind(this.onDataReturnInitializeTable,this),failure:Y.bind(this.onDataReturnInitializeTable,this),argument:this.get("host").get("state")};var ds=(config.datasource||this.get("datasource"));if(ds){ds.sendRequest(config);}},onDataReturnInitializeTable:function(e){this.get("host").set("recordset",new Y.Recordset({records:e.response.results}));}});Y.namespace("Plugin").DataTableDataSource=DataTableDataSource;},'3.3.0',{requires:['datatable-base','plugin','datasource-local']});YUI.add('datatable-sort',function(Y){var YgetClassName=Y.ClassNameManager.getClassName,DATATABLE="datatable",COLUMN="column",ASC="asc",DESC="desc",TEMPLATE='<a class="{link_class}" title="{link_title}" href="{link_href}">{value}</a>';function DataTableSort(){DataTableSort.superclass.constructor.apply(this,arguments);}
Y.mix(DataTableSort,{NS:"sort",NAME:"dataTableSort",ATTRS:{trigger:{value:{event:"click",selector:"th"},writeOnce:"initOnly"},lastSortedBy:{setter:"_setLastSortedBy",lazyAdd:false},template:{value:TEMPLATE}}});Y.extend(DataTableSort,Y.Plugin.Base,{initializer:function(config){var dt=this.get("host"),trigger=this.get("trigger");dt.get("recordset").plug(Y.Plugin.RecordsetSort,{dt:dt});dt.get("recordset").sort.addTarget(dt);this.doBefore("_createTheadThNode",this._beforeCreateTheadThNode);this.doBefore("_attachTheadThNode",this._beforeAttachTheadThNode);this.doBefore("_attachTbodyTdNode",this._beforeAttachTbodyTdNode);dt.delegate(trigger.event,Y.bind(this._onEventSortColumn,this),trigger.selector);dt.after("recordsetSort:sort",function(){this._uiSetRecordset(this.get("recordset"));});this.on("lastSortedByChange",function(e){this._uiSetLastSortedBy(e.prevVal,e.newVal,dt);});if(dt.get("rendered")){dt._uiSetColumnset(dt.get("columnset"));this._uiSetLastSortedBy(null,this.get("lastSortedBy"),dt);}},_setLastSortedBy:function(val){if(Y.Lang.isString(val)){return{key:val,dir:"asc",notdir:"desc"};}
else if(val&&val.key){if(val.dir==="desc"){return{key:val.key,dir:"desc",notdir:"asc"};}
else{return{key:val.key,dir:"asc",notdir:"desc"};}}
else{return null;}},_uiSetLastSortedBy:function(prevVal,newVal,dt){var prevKey=prevVal&&prevVal.key,prevDir=prevVal&&prevVal.dir,newKey=newVal&&newVal.key,newDir=newVal&&newVal.dir,cs=dt.get("columnset"),prevColumn=cs.keyHash[prevKey],newColumn=cs.keyHash[newKey],tbodyNode=dt._tbodyNode,prevRowList,newRowList;if(prevColumn){prevColumn.thNode.removeClass(YgetClassName(DATATABLE,prevDir));prevRowList=tbodyNode.all("."+YgetClassName(COLUMN,prevColumn.get("id")));prevRowList.removeClass(YgetClassName(DATATABLE,prevDir));}
if(newColumn){newColumn.thNode.addClass(YgetClassName(DATATABLE,newDir));newRowList=tbodyNode.all("."+YgetClassName(COLUMN,newColumn.get("id")));newRowList.addClass(YgetClassName(DATATABLE,newDir));}},_beforeCreateTheadThNode:function(o){if(o.column.get("sortable")){o.value=Y.substitute(this.get("template"),{link_class:o.link_class||"",link_title:"title",link_href:"#",value:o.value});}},_beforeAttachTheadThNode:function(o){var lastSortedBy=this.get("lastSortedBy"),key=lastSortedBy&&lastSortedBy.key,dir=lastSortedBy&&lastSortedBy.dir,notdir=lastSortedBy&&lastSortedBy.notdir;if(o.column.get("sortable")){o.th.addClass(YgetClassName(DATATABLE,"sortable"));}
if(key&&(key===o.column.get("key"))){o.th.replaceClass(YgetClassName(DATATABLE,notdir),YgetClassName(DATATABLE,dir));}},_beforeAttachTbodyTdNode:function(o){var lastSortedBy=this.get("lastSortedBy"),key=lastSortedBy&&lastSortedBy.key,dir=lastSortedBy&&lastSortedBy.dir,notdir=lastSortedBy&&lastSortedBy.notdir;if(o.column.get("sortable")){o.td.addClass(YgetClassName(DATATABLE,"sortable"));}
if(key&&(key===o.column.get("key"))){o.td.replaceClass(YgetClassName(DATATABLE,notdir),YgetClassName(DATATABLE,dir));}},_onEventSortColumn:function(e){e.halt();var dt=this.get("host"),column=dt.get("columnset").idHash[e.currentTarget.get("id")],key=column.get("key"),field=column.get("field"),lastSortedBy=this.get("lastSortedBy"),dir=(lastSortedBy&&lastSortedBy.key===key&&lastSortedBy.dir===ASC)?DESC:ASC,sorter=column.get("sortFn");if(column.get("sortable")){dt.get("recordset").sort.sort(field,dir===DESC,sorter);this.set("lastSortedBy",{key:key,dir:dir});}}});Y.namespace("Plugin").DataTableSort=DataTableSort;},'3.3.0',{lang:['en'],requires:['datatable-base','plugin','recordset-sort']});YUI.add('datatable-scroll',function(Y){var YNode=Y.Node,YLang=Y.Lang,YUA=Y.UA,YgetClassName=Y.ClassNameManager.getClassName,DATATABLE="datatable",CLASS_HEADER=YgetClassName(DATATABLE,"hd"),CLASS_BODY=YgetClassName(DATATABLE,"bd"),CLASS_SCROLLABLE=YgetClassName(DATATABLE,"scrollable"),CONTAINER_HEADER='<div class="'+CLASS_HEADER+'"></div>',CONTAINER_BODY='<div class="'+CLASS_BODY+'"></div>',TEMPLATE_TABLE='<table></table>';function DataTableScroll(){DataTableScroll.superclass.constructor.apply(this,arguments);}
Y.mix(DataTableScroll,{NS:"scroll",NAME:"dataTableScroll",ATTRS:{width:{value:undefined,writeOnce:"initOnly"},height:{value:undefined,writeOnce:"initOnly"},_scroll:{valueFn:function(){var w=this.get('width'),h=this.get('height');if(w&&h){return'xy';}
else if(w){return'x';}
else if(h){return'y';}
else{return null;}}},COLOR_COLUMNFILLER:{value:'#f2f2f2',validator:YLang.isString,setter:function(param){if(this._headerContainerNode){this._headerContainerNode.setStyle('backgroundColor',param);}}}}});Y.extend(DataTableScroll,Y.Plugin.Base,{_parentTableNode:null,_parentTheadNode:null,_parentTbodyNode:null,_parentMsgNode:null,_parentContainer:null,_bodyContainerNode:null,_headerContainerNode:null,initializer:function(config){var dt=this.get("host");this._parentContainer=dt.get('contentBox');this._parentContainer.addClass(CLASS_SCROLLABLE);this._setUpNodes();},_setUpNodes:function(){this.afterHostMethod("_addTableNode",this._setUpParentTableNode);this.afterHostMethod("_addTheadNode",this._setUpParentTheadNode);this.afterHostMethod("_addTbodyNode",this._setUpParentTbodyNode);this.afterHostMethod("_addMessageNode",this._setUpParentMessageNode);this.afterHostMethod("renderUI",this.renderUI);this.afterHostMethod("syncUI",this.syncUI);if(this.get('_scroll')!=='x'){this.afterHostMethod('_attachTheadThNode',this._attachTheadThNode);this.afterHostMethod('_attachTbodyTdNode',this._attachTbodyTdNode);}},_setUpParentTableNode:function(){this._parentTableNode=this.get('host')._tableNode;},_setUpParentTheadNode:function(){this._parentTheadNode=this.get('host')._theadNode;},_setUpParentTbodyNode:function(){this._parentTbodyNode=this.get('host')._tbodyNode;},_setUpParentMessageNode:function(){this._parentMsgNode=this.get('host')._msgNode;},renderUI:function(){this._createBodyContainer();this._createHeaderContainer();this._setContentBoxDimensions();},syncUI:function(){this._removeCaptionNode();this._syncWidths();this._syncScroll();},_removeCaptionNode:function(){this.get('host')._captionNode.remove();},_syncWidths:function(){var th=YNode.all('#'+this._parentContainer.get('id')+' .yui3-datatable-hd table thead th'),td=YNode.one('#'+this._parentContainer.get('id')+' .yui3-datatable-bd table .yui3-datatable-data').get('firstChild').get('children'),i,len,thWidth,tdWidth,thLiner,tdLiner,ie=YUA.ie;for(i=0,len=th.size();i<len;i++){thLiner=th.item(i).get('firstChild');tdLiner=td.item(i).get('firstChild');if(!ie){thWidth=thLiner.get('clientWidth');tdWidth=td.item(i).get('clientWidth');}
else{thWidth=thLiner.get('offsetWidth');tdWidth=td.item(i).get('offsetWidth');}
if(thWidth>tdWidth){tdLiner.setStyle('width',(thWidth-20+'px'));}
else if(tdWidth>thWidth){thLiner.setStyle('width',(tdWidth-20+'px'));tdLiner.setStyle('width',(tdWidth-20+'px'));}}},_attachTheadThNode:function(o){var w=o.column.get('width')||'auto';if(w!=='auto'){o.th.get('firstChild').setStyles({width:w,overflow:'hidden'});}
return o;},_attachTbodyTdNode:function(o){var w=o.column.get('width')||'auto';if(w!=='auto'){o.td.get('firstChild').setStyles({width:w,overflow:'hidden'});}
return o;},_createBodyContainer:function(){var bd=YNode.create(CONTAINER_BODY),onScrollFn=Y.bind("_onScroll",this);this._bodyContainerNode=bd;this._setStylesForTbody();bd.appendChild(this._parentTableNode);this._parentContainer.appendChild(bd);bd.on('scroll',onScrollFn);},_createHeaderContainer:function(){var hd=YNode.create(CONTAINER_HEADER),tbl=YNode.create(TEMPLATE_TABLE);this._headerContainerNode=hd;this._setStylesForThead();tbl.appendChild(this._parentTheadNode);hd.appendChild(tbl);this._parentContainer.prepend(hd);},_setStylesForTbody:function(){var dir=this.get('_scroll'),w=this.get('width')||"",h=this.get('height')||"",el=this._bodyContainerNode,styles={width:"",height:h};if(dir==='x'){styles.overflowY='hidden';styles.width=w;}
else if(dir==='y'){styles.overflowX='hidden';}
else if(dir==='xy'){styles.width=w;}
else{styles.overflowX='hidden';styles.overflowY='hidden';styles.width=w;}
el.setStyles(styles);return el;},_setStylesForThead:function(){var w=this.get('width')||"",el=this._headerContainerNode;el.setStyles({'width':w,'overflow':'hidden'});},_setContentBoxDimensions:function(){if(this.get('_scroll')==='y'||(!this.get('width'))){this._parentContainer.setStyle('width','auto');}},_onScroll:function(){this._headerContainerNode.set('scrollLeft',this._bodyContainerNode.get('scrollLeft'));},_syncScroll:function(){this._syncScrollX();this._syncScrollY();this._syncScrollOverhang();if(YUA.opera){this._headerContainerNode.set('scrollLeft',this._bodyContainerNode.get('scrollLeft'));if(!this.get("width")){document.body.style+='';}}},_syncScrollY:function(){var tBody=this._parentTbodyNode,tBodyContainer=this._bodyContainerNode,w;if(!this.get("width")){w=(tBodyContainer.get('scrollHeight')>tBodyContainer.get('clientHeight'))?(tBody.get('parentNode').get('clientWidth')+19)+"px":(tBody.get('parentNode').get('clientWidth')+2)+"px";this._parentContainer.setStyle('width',w);}},_syncScrollX:function(){var tBody=this._parentTbodyNode,tBodyContainer=this._bodyContainerNode,w;this._headerContainerNode.set('scrollLeft',this._bodyContainerNode.get('scrollLeft'));if(!this.get('height')&&(YUA.ie)){w=(tBodyContainer.get('scrollWidth')>tBodyContainer.get('offsetWidth'))?(tBody.get('parentNode').get('offsetHeight')+18)+"px":tBody.get('parentNode').get('offsetHeight')+"px";tBodyContainer.setStyle('height',w);}
if(tBody.get('rows').length===0){this._parentMsgNode.get('parentNode').setStyle('width',this._parentTheadNode.get('parentNode').get('offsetWidth')+'px');}
else{this._parentMsgNode.get('parentNode').setStyle('width',"");}},_syncScrollOverhang:function(){var tBodyContainer=this._bodyContainerNode,padding=1;if((tBodyContainer.get('scrollHeight')>tBodyContainer.get('clientHeight'))||(tBodyContainer.get('scrollWidth')>tBodyContainer.get('clientWidth'))){padding=18;}
this._setOverhangValue(padding);if(YUA.ie!==0&&this.get('_scroll')==='y'&&this._bodyContainerNode.get('scrollHeight')>this._bodyContainerNode.get('offsetHeight'))
{this._headerContainerNode.setStyle('width',this._parentContainer.get('width'));}},_setOverhangValue:function(borderWidth){var host=this.get('host'),cols=host.get('columnset').get('definitions'),len=cols.length,value=borderWidth+"px solid "+this.get("COLOR_COLUMNFILLER"),children=YNode.all('#'+this._parentContainer.get('id')+' .'+CLASS_HEADER+' table thead th');children.item(len-1).setStyle('borderRight',value);}});Y.namespace("Plugin").DataTableScroll=DataTableScroll;},'3.3.0',{requires:['datatable-base','plugin','stylesheet']});YUI.add('datatable',function(Y){},'3.3.0',{use:['datatable-base','datatable-datasource','datatable-sort','datatable-scroll']});