%% a note counter for .mmp files (used for LMMS projects)
%%
%% helpful! https://www.davekuhlman.org/notes-on-xml-and-xmerl.html
%% https://stackoverflow.com/questions/77362179/how-to-check-if-a-list-of-records-contains-a-specific-record-in-erlang
%% https://stackoverflow.com/questions/1110601/in-erlang-when-do-i-use-or-or
%% https://www.erlang.org/docs/17/reference_manual/data_types
%%
%% usage:
%% open erl shell via `erl`
%% > c(mmp_note_counter).
%% > mmp_note_counter:test("testxml.mmp").

-module(mmp_note_counter).
-include_lib("xmerl/include/xmerl.hrl").

-export([
  test/1
]).


%%%% define a new record for keeping track of note counts per instrument
-record(instrumentNoteCount, {name='', count=0}).


%%%% print helper
print_inst_list([]) -> [];
print_inst_list([First | Rest]) ->
  io:format("instrument found: ~p\n", [First]),
  print_inst_list(Rest).


%%%% get the number of notes in a pattern element
get_num_notes_in_pattern([]) ->
  0;
  
get_num_notes_in_pattern([First | Rest]) ->
  if
    First#xmlElement.name == 'note' ->
      1 + get_num_notes_in_pattern(Rest);
      
  true -> get_num_notes_in_pattern(Rest)
  
  end.


%%%% get the name attribute value of an element (useful for getting the track name of a track element)
get_name_attribute([]) ->
  'no track name found.';  %% use semi-colon to help associate related recursive functions

get_name_attribute([First | Rest]) ->
  if
    First#xmlAttribute.name == 'name' ->
      First#xmlAttribute.value;

    true -> get_name_attribute(Rest)
  end.


%%%% get all instrument names in the piece
get_instruments([], Acc) -> 
  Acc;

get_instruments([First | Rest], Acc) ->
  if
    First#xmlElement.name == 'track' -> 
      get_instruments(Rest, [get_name_attribute(First#xmlElement.attributes) | Acc]);
      
    %% keep recursing through song and trackcontainer elements until we hit track elements,
    %% which should be nested in trackcontainer elements
    First#xmlElement.name == 'song' ->
      get_instruments(First#xmlElement.content, Acc);
   
    First#xmlElement.name == 'trackcontainer' ->
      get_instruments(First#xmlElement.content, Acc);

    true -> get_instruments(Rest, Acc)
  end.


%%%% get total number of notes in piece
get_note_counts([], Acc) -> 
  Acc;

get_note_counts([First | Rest], Acc) ->
  if
    First#xmlElement.name == 'pattern' ->
      %% a pattern may have multiple patterns that are sibling elements so we need to continue recursing
      get_num_notes_in_pattern(First#xmlElement.content) + get_note_counts(Rest, Acc);
      
    %% keep recursing through song, trackcontainer and track elements until we hit a pattern element
    First#xmlElement.name == 'song' ->
      get_note_counts(First#xmlElement.content, Acc);
   
    First#xmlElement.name == 'trackcontainer' ->
      get_note_counts(First#xmlElement.content, Acc);
      
    First#xmlElement.name == 'track' ->
      %% a track may have multiple sibling track elements so we need to go through the rest of the content
      get_note_counts(First#xmlElement.content, Acc) + get_note_counts(Rest, Acc);

    true -> get_note_counts(Rest, Acc)
  end.


%%%% get number of notes for a specific instrument
get_instrument_note_count([], _, Acc) -> 
  Acc;

get_instrument_note_count([First | Rest], Inst, Acc) ->
  if
    First#xmlElement.name == 'pattern' ->
      %% a pattern may have multiple patterns that are sibling elements so we need to continue recursing
      %% patterns are within tracks so at this point this pattern should belong to a track with a name that matches whatever Inst is
      get_num_notes_in_pattern(First#xmlElement.content) + get_instrument_note_count(Rest, Inst, Acc);

    %% keep recursing through song, trackcontainer and track elements until we hit a pattern element
    First#xmlElement.name == 'song' ->
      get_instrument_note_count(First#xmlElement.content, Inst, Acc);

    First#xmlElement.name == 'trackcontainer' ->
      get_instrument_note_count(First#xmlElement.content, Inst, Acc);

    First#xmlElement.name == 'track' ->
      case (get_name_attribute(First#xmlElement.attributes) == Inst) of
        true ->
          %% a track may have multiple sibling track elements so we need to go through the rest of the content
          get_instrument_note_count(First#xmlElement.content, Inst, Acc) + get_instrument_note_count(Rest, Inst, Acc);
        
        false -> 
          get_instrument_note_count(Rest, Inst, Acc)
      end;

    true -> get_instrument_note_count(Rest, Inst, Acc)
  end.


%%%% get total notes per instrument in piece
get_instrument_note_counts(_, [], Acc) ->
  Acc;

get_instrument_note_counts(XmlContent, [FirstInst | RestInst], Acc) ->
  get_instrument_note_counts(
    XmlContent,
    RestInst,
    [#instrumentNoteCount{
      name=FirstInst,
      count=get_instrument_note_count(XmlContent, FirstInst, 0)
    } | Acc]
  ).


test(Path) -> 
  { ParseResult, _ } = xmerl_scan:file(Path),  %% path="xmltest.mmp"
  
  %% print the instruments found
  print_inst_list(get_instruments(ParseResult#xmlElement.content, [])),
  
  %% show total note count
  io:format("total note count: ~p\n", [get_note_counts(ParseResult#xmlElement.content, 0)]),
  
  %% get individual note counts
  get_instrument_note_counts(
    ParseResult#xmlElement.content, 
    get_instruments(ParseResult#xmlElement.content, []),
    []
  ).
  
  %%get_instrument_note_count(ParseResult#xmlElement.content, "piano", 0).
  %%get_note_counts(ParseResult#xmlElement.content, 0).
  