# AKSA Reference Stack

This list is a design/implementation reference, not a blanket dependency decision.

| Reference | AKSA use | Current direction |
|---|---|---|
| OpenMAIC | AI classroom, generation, interactives, PBL | Adapter / selective integration |
| Univer | spreadsheet/docs/presentation labs | Strong candidate |
| JupyterLite | browser/offline code & data lab | Strong candidate |
| React Flow / XYFlow | skill/curriculum graphs | Strong candidate |
| That Open Engine | BIM/IFC learning | Strong candidate |
| Jitsi | 1:1 / instant tutor call | Candidate service |
| BigBlueButton | full educational live classroom | Optional service |
| Open Badges 3.0 | Skills Passport credential model | Adopt standard |
| H5P | interaction/content-type patterns | Adapt concepts selectively |
| PhET | science simulation pedagogy | Design reference |
| GeoGebra | math interaction patterns | Reference; licensing caution |
| Open edX Studio | authoring/governance workflow | Reference |
| LabXchange | library/pathway/remix | Reference |
| Excalidraw | lightweight whiteboard/canvas | Candidate |
| Moodle | institutional LMS patterns | Reference only |

## Integration decision rule

Before any dependency is added, a batch-specific technical audit must record:
- license,
- bundle/runtime model,
- offline behavior,
- security boundary,
- data ownership,
- upgrade strategy,
- adapter contract,
- exit strategy.
